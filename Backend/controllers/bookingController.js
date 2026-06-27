import Booking from '../models/Booking.js';

export const createBooking = async (req, res) => {
    try {
        const { ground, bookingDate, startTime, endTime, totalPrice, paymentStatus, customerName, customerPhone, customerEmail, customerAddress } = req.body;

        const existingBooking = await Booking.findOne({
            ground,
            bookingDate,
            startTime,
            status: "booked",
        })

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: "Ground is already booked for the selected time slot",
            });
        }

        const booking = await Booking.create({
            user: req.user._id,
            ground,
            bookingDate,
            startTime,
            endTime,
            totalPrice,
            paymentStatus: paymentStatus || "pending",
            customerName,
            customerPhone,
            customerEmail,
            customerAddress,
        });

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating booking",
            error: error.message,
        });
    }
}

export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('ground');

        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            count: bookings.length,
            bookings,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving bookings",
            error: error.message,
        });
    }
}

export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to cancel this booking",
            });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            booking,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error cancelling booking",
            error: error.message,
        });
    }
}

export const checkBookedSlots = async (req, res) => {
    try {
        const { ground, date } = req.query;

        const bookings = await Booking.find({
            ground,
            bookingDate: date,
            status: "booked",
        });

        const bookedSlots = bookings.map((booking) => booking.startTime);
        res.status(200).json({
            success: true,
            message: "Booked slots retrieved successfully",
            bookedSlots,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving booked slots",
            error: error.message,
        });
    }
}

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("ground")
            .populate("user", "name email")
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            message: "All bookings retrieved successfully",
            count: bookings.length,
            bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching all bookings",
            error: error.message,
        });
    }
}