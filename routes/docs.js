const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Document = require("../models/Document");

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDFs are allowed"));
    }
    cb(null, true);
  }
});

// POST /api/docs/upload
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const document = await Document.create({
      userId: req.user.id,
      originalName: req.file.originalname,
      filePath: req.file.path,
      uploadDate: new Date()
    });

    res.status(201).json({
      message: "Uploaded",
      document
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/docs/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    res.status(200).json(doc);
  } catch (err) {
    console.error("Get Doc Error:", err);
    res.status(500).json({ message: "Error retrieving document" });
  }
});

module.exports = router;
