import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token missing",
            });
        }

        token = token.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password'); //not include password in the user object
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Not authorized, token failed",
            error: error.message
        });
    }
};