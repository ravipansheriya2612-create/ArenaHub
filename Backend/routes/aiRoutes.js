import express from "express";
import { improveReview } from "../controllers/aiController.js";

const router = express.Router();

router.post("/improve-review", improveReview);

export default router;