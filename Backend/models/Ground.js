import mongoose from "mongoose";

const groundSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        sportType: {
            type: String,
            required: true,
            enum: ["football", "basketball", "tennis", "cricket", "volleyball", "badminton", "hockey", "rugby", "swimming", "other"],
        },

        pricePerHour: {
            type: Number,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },

        city: {
            type: String,
            default: "Surat",
        },

        image: {
            type: String,
            default: "",
        },

        description: {
            type: String,
        },

        isAvailable: {
            type: Boolean,
            default: true,
        },

        public_id: {
            type: String,
            default: "",
        },

        locationUrl: {
            type: String,
            trim: true,
        },
    },

    { timestamps: true }
);

const Ground = mongoose.model("Ground", groundSchema);

export default Ground;