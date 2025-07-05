const AuditLog = require("../models/AuditLog");

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({ documentId: req.params.docId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to load audit logs" });
  }
};
