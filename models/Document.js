const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  filename: String,
  originalName: String,
  uploadDate: {
    type: Date,
    default: Date.now
  },
  filePath: String
});

module.exports = mongoose.model("Document", documentSchema);
