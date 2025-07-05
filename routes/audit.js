const express = require("express");
const router = express.Router();
const { getAuditLogs } = require("../controllers/auditController");
const auth = require("../middleware/auth");

router.get("/:docId", auth, getAuditLogs);

module.exports = router;
