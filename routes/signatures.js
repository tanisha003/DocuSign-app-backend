const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { saveSignature,finalizeSignature,
  generatePublicLink,
  getSignatureByToken } = require("../controllers/signatureController");
const logAction = require("../middleware/logAction");

router.post("/", auth, saveSignature);

router.post("/finalize", auth, finalizeSignature);

router.post("/generate-link", auth, generatePublicLink);

router.get("/public/:token", getSignatureByToken);
 
router.post("/finalize", auth, logAction("Signed"), finalizeSignature);

module.exports = router;
