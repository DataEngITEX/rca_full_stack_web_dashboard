import express from "express";
import multer from "multer";
import { uploadFile } from "../controllers/fileController.js";

const router = express.Router();

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/tmp"); // Render allows writing to /tmp
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Create multer instance with storage
const upload = multer({ storage });

// Route for CSV upload
router.post("/uploadFile", upload.single("file"), uploadFile);

export default router;
