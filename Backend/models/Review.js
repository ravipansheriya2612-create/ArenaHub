import { Moon } from "lucide-react";
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
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

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },

    comment: {
        type: String,
        required: true,
        trim: true,
    },

    aiComment: {
        type: String,
        trim: true,
        default: "",
    }
}, { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;