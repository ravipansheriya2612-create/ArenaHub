import express from "express";
import { improveReview } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/improve-review", protect, improveReview);

export default router;