import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        ground: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ground",
            required: true,
        },

        bookingDate: {
            type: String,
            required: true,
        },

        startTime: {
            type: String,
            required: true,
        },

        endTime: {
            type: String,
            required: true,
        },

        totalPrice: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ["booked", "cancelled", "completed"],
            default: "booked",
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },

        customerName: {
            type: String,
            required: true,
            trim: true,
        },

        customerPhone: {
            type: String,
            required: true,
            trim: true,
        },

        customerEmail: {
            type: String,
            required: true,
            trim: true,
        },

        customerAddress: {
            type: String,
            require: true,
            trim: true,
        }
    },

    { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;