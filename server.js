const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

app.get("/", (req, res) => res.send("API running"));

app.use("/api/auth", authRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const docRoutes = require("./routes/docs");
app.use("/api/docs", docRoutes);
app.use("/uploads", express.static("uploads")); // to serve PDF files

const signatureRoutes = require("./routes/signatures");
app.use("/api/signatures", signatureRoutes);

const auditRoutes = require("./routes/audit");
app.use("/api/audit", auditRoutes);
