import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import merchantRoutes from "./routes/merchantsRoute.js";
import uploadRoutes from "./routes/fileRoute.js";
import authRoutes from "./routes/authRoute.js";
// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://rca-terminal-dashboard.vercel.app", // or restrict to your frontend URL for more security
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// API routes
app.use("/api/merchants", merchantRoutes);
app.use("/api/file", uploadRoutes);
app.use("/api/auth", authRoutes);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
