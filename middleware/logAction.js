const AuditLog = require("../models/AuditLog");

const logAction = (action) => {
  return async (req, res, next) => {
    try {
      await AuditLog.create({
        userId: req.user?.id || null,
        documentId: req.body.documentId,
        action,
        ip: req.ip || req.headers["x-forwarded-for"] || "unknown"
      });
    } catch (err) {
      console.error("Audit log error:", err.message);
    }
    next();
  };
};

module.exports = logAction;
