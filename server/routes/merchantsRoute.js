import express from "express";
import {
  getAllMerchants,
  getMerchantStats,
} from "../controllers/merchantsController.js";

const router = express.Router();

router.get("/getAllMerchants", getAllMerchants);
router.get("/getMerchantStats", getMerchantStats);

export default router;
