const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb } = require("pdf-lib");
const Signature = require("../models/Signature");
const Document = require("../models/Document");

exports.saveSignature = async (req, res) => {
  try {
    const { documentId, x, y, page } = req.body;

    if (!documentId || x === undefined || y === undefined || !page) {
      return res.status(400).json({ message: "Missing signature data" });
    }

    const signature = await Signature.create({
      documentId,
      userId: req.user.id,
      x,
      y,
      page,
      status: "pending"
    });

    res.status(201).json({
      message: "Signature saved",
      signature
    });

  } catch (err) {
    console.error("Signature Save Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.finalizeSignature = async (req, res) => {
  try {
    const { documentId } = req.body;

    const document = await Document.findById(documentId);
    if (!document) return res.status(404).json({ message: "Document not found" });

    const signatures = await Signature.find({ documentId });

    const pdfPath = path.join(__dirname, "..", document.filePath);
    const fileBytes = fs.readFileSync(pdfPath);

    const pdfDoc = await PDFDocument.load(fileBytes);

    const font = await pdfDoc.embedFont(PDFDocument.PDFName.of("Helvetica"));
    
     const sigImageBytes = fs.readFileSync(
      path.join(__dirname, "..", "signatures", "sample-signature.png")
    );
    const pngImage = await pdfDoc.embedPng(sigImageBytes);

    const sigWidth = 120;
    const sigHeight = 40;
    
    signatures.forEach((sig) => {
      const page = pdfDoc.getPage(sig.page - 1);
      page.drawText("✔ Signed", {
        x: sig.x,
        y: sig.y,
        size: 14,
        color: rgb(0.1, 0.2, 0.6),
      });
    });

    const pdfBytes = await pdfDoc.save();

    const outputPath = path.join("uploads", `signed-${Date.now()}.pdf`);
    fs.writeFileSync(outputPath, pdfBytes);

    res.status(200).json({
      message: "Signed PDF generated",
      downloadUrl: outputPath,
    });
  } catch (err) {
    console.error("Finalize Error:", err);
    res.status(500).json({ message: "Error finalizing PDF", error: err.message });
  }
};

const crypto = require("crypto");

exports.generatePublicLink = async (req, res) => {
  try {
    const { documentId } = req.body;

    const token = crypto.randomBytes(20).toString("hex");

    const signature = await Signature.create({
      documentId,
      userId: req.user.id,
      x: 0, y: 0, page: 1, // placeholder
      status: "pending",
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hrs
    });

    const link = `http://localhost:5173/sign/${token}`;
    res.status(201).json({ message: "Link created", link });
  } catch (err) {
    console.error("Public Link Error:", err);
    res.status(500).json({ message: "Failed to generate link", error: err.message });
  }
};
exports.getSignatureByToken = async (req, res) => {
  try {
    const { token } = req.params;

    const signature = await Signature.findOne({ token }).populate("documentId");

    if (!signature || signature.status !== "pending") {
      return res.status(404).json({ message: "Invalid or expired link" });
    }

    res.status(200).json({
      document: signature.documentId,
      signatureId: signature._id
    });
  } catch (err) {
    res.status(500).json({ message: "Error loading link", error: err.message });
  }
};

