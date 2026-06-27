import express from "express";
import { createReview, getGroundReviews} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/ground/:groundId", getGroundReviews);

export default router;