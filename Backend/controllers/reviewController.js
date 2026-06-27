import Review from "../models/Review.js";

export const createReview = async (req, res) => {
    try {
        const { ground, rating, comment, aiComment } = req.body;

        const review = await Review.create({
            user: req.user._id,
            ground,
            rating,
            comment,
            aiComment,
        });

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add review",
            error: error.message,
        });
    }

};

export const getGroundReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            ground: req.params.groundId,
        })
            .populate("user", "name").sort({ createdAt: -1 });

        const avgRating = reviews.length === 0 ? 0 : reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

        res.status(200).json({
            success: true,
            count: reviews.length,
            avgRating: avgRating.toFixed(1),
            reviews,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch reviews",
            error: error.message,
        });
    }
}