import dotenv from "dotenv";
dotenv.config();

import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/Booking.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        res.status(200).json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Order creation failed",
            error: error.message,
        });
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingId,
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign).digest("hex");

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature",
            });
        }

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { paymentStatus: "paid" },
            { new: true },
        );

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Payment verification failed",
            error: error.message,
        });

    }
}