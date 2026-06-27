import express from 'express';
import { getAllGrounds, createGround, getGroundById, updateGround, deleteGround } from '../controllers/groundController.js';
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import upload from "../config/cloudinary.js";

const router = express.Router();

router.get('/', getAllGrounds);
router.post('/', protect, adminOnly, upload.single("image"), createGround);
router.put('/:id', protect, adminOnly, upload.single("image"), updateGround);
router.delete('/:id', protect, adminOnly, upload.single("image"), deleteGround);
router.get('/:id', getGroundById);

export default router;