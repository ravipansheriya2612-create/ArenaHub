import express from 'express';
import { createBooking, getMyBookings, cancelBooking, checkBookedSlots, getAllBookings } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get("/", protect, adminOnly, getAllBookings);
router.put('/cancel/:id', protect, cancelBooking);
router.get("/check", checkBookedSlots);

export default router;