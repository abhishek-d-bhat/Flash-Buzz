import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import analysisRoutes from "./routes/analysis.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "FlashBuzz API is running 🚀"
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Analysis routes
app.use("/api/analysis", analysisRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 FlashBuzz backend running on http://localhost:${PORT}`);
});