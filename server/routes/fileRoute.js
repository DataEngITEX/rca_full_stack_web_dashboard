import express from "express";
import multer from "multer";
import { uploadFile } from "../controllers/fileController.js";

const router = express.Router();

// Configure disk storage without renaming
const upload = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/tmp"); // save into uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // keep original filename
  },
});

///const upload = multer({ storage });

// Route for CSV upload
router.post("/uploadFile", upload.single("file"), uploadFile);

export default router;
