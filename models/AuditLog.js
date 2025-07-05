const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
  action: String, // e.g., "Signed", "Rejected"
  ip: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
