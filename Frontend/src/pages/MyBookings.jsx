import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            if (!token || token === "undefined") {
                setBookings([]);
                return;
            }

            const res = await API.get("/bookings/my-bookings", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("MY BOOKINGS RESPONSE:", res.data);

            const fetchedBookings = res.data?.bookings || [];

            // Latest booking first
            const sortedBookings = [...fetchedBookings].sort((a, b) => {
                const dateA = new Date(
                    `${a.bookingDate || ""} ${a.startTime || "00:00"}`
                );

                const dateB = new Date(
                    `${b.bookingDate || ""} ${b.startTime || "00:00"}`
                );

                return dateB - dateA;
            });

            setBookings(sortedBookings);

        } catch (error) {
            console.error(
                "FETCH BOOKINGS ERROR:",
                error.response?.data || error
            );

            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
            } else {
                toast.error(
                    error.response?.data?.message ||
                    "Failed to load bookings"
                );
            }

            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const cancelBooking = async (bookingId) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) return;

        try {
            setCancellingId(bookingId);

            const token = localStorage.getItem("token");

            await API.put(
                `/bookings/cancel/${bookingId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Booking cancelled successfully");

            await fetchBookings();

        } catch (error) {
            console.error(
                "CANCEL BOOKING ERROR:",
                error.response?.data || error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to cancel booking"
            );
        } finally {
            setCancellingId(null);
        }
    };

    // Do NOT require booking.ground here.
    // The backend response should still be displayed.
    const activeBookings = bookings.filter(
        (booking) =>
            String(booking.status || "").toLowerCase() !== "cancelled"
    );

    const latestBooking = activeBookings[0];

    const getGround = (booking) => {
        return booking?.ground || {};
    };

    const getGroundImage = (booking) => {
        const ground = getGround(booking);

        if (ground.image) return ground.image;

        if (ground.imageUrl) return ground.imageUrl;

        if (Array.isArray(ground.images) && ground.images.length > 0) {
            return ground.images[0];
        }

        return "https://via.placeholder.com/800x500?text=Sports+Ground";
    };

    const formatDate = (date) => {
        if (!date) return "Not available";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getGroundName = (booking) => {
        const ground = getGround(booking);

        return (
            ground.name ||
            booking.groundName ||
            "Sports Ground"
        );
    };

    const getSportType = (booking) => {
        const ground = getGround(booking);

        return (
            ground.sportType ||
            booking.sportType ||
            "Sports"
        );
    };

    const getLocation = (booking) => {
        const ground = getGround(booking);

        return (
            ground.location ||
            ground.address ||
            booking.location ||
            "Location not available"
        );
    };

    const getAmount = (booking) => {
        return (
            booking.totalPrice ??
            booking.totalAmount ??
            booking.amount ??
            0
        );
    };

    const getPaymentStatus = (booking) => {
        return (
            booking.paymentStatus ||
            booking.payment?.status ||
            "Pending"
        );
    };

    const getBookingStatus = (booking) => {
        return booking.status || "confirmed";
    };

    return (
        <div className="min-h-screen bg-slate-100">

            <Navbar />

            <main className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">

                    <div>
                        <p className="text-green-600 font-bold tracking-[0.2em] text-sm mb-3">
                            ARENAHUB
                        </p>

                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900">
                            My Bookings
                        </h1>

                        <p className="text-slate-500 mt-3 text-lg">
                            View and manage all your sports ground bookings.
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold px-7 py-4 rounded-xl shadow-md transition"
                    >
                        + Book Another Ground
                    </Link>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7 mb-10">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                        <div>
                            <p className="text-slate-500 text-sm">
                                Active Bookings
                            </p>

                            <p className="text-4xl font-extrabold text-slate-900 mt-1">
                                {activeBookings.length}
                            </p>
                        </div>

                        <div className="sm:text-right">
                            <p className="text-slate-500 text-sm">
                                Latest booking
                            </p>

                            <p className="text-lg font-bold text-green-600 mt-1">
                                {latestBooking
                                    ? getGroundName(latestBooking)
                                    : "No active bookings"}
                            </p>
                        </div>

                    </div>

                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* Empty */}
                {!loading && activeBookings.length === 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm text-center py-20 px-6">

                        <div className="text-6xl mb-5">
                            🏟️
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900">
                            No active bookings
                        </h2>

                        <p className="text-slate-500 mt-2 mb-7">
                            You don't have any active sports ground bookings.
                        </p>

                        <Link
                            to="/"
                            className="inline-flex bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl"
                        >
                            Explore Sports Grounds
                        </Link>

                    </div>
                )}

                {/* BOOKINGS */}
                {!loading && activeBookings.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">

                        {activeBookings.map((booking, index) => {

                            const ground = getGround(booking);

                            return (
                                <div
                                    key={booking._id || booking.id || index}
                                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition"
                                >

                                    {/* Ground Image */}
                                    <div className="relative h-60 bg-slate-200">

                                        <img
                                            src={getGroundImage(booking)}
                                            alt={getGroundName(booking)}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "https://via.placeholder.com/800x500?text=Sports+Ground";
                                            }}
                                        />

                                        {/* Latest */}
                                        {index === 0 && (
                                            <span className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-2 rounded-full">
                                                LATEST BOOKING
                                            </span>
                                        )}

                                        {/* Status */}
                                        <span
                                            className={`absolute top-4 right-4 text-xs font-bold px-3 py-2 rounded-full ${String(getBookingStatus(booking)).toLowerCase() ===
                                                "confirmed"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {String(getBookingStatus(booking)).toUpperCase()}
                                        </span>

                                    </div>

                                    {/* Content */}
                                    <div className="p-6">

                                        {/* Ground */}
                                        <div className="mb-6">

                                            <p className="text-sm text-green-600 font-bold uppercase tracking-wide">
                                                {getSportType(booking)}
                                            </p>

                                            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                                                {getGroundName(booking)}
                                            </h2>

                                            <p className="text-slate-500 mt-2">
                                                📍 {getLocation(booking)}
                                            </p>

                                        </div>

                                        {/* Booking details */}
                                        <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-5">

                                            <div>
                                                <p className="text-xs text-slate-400 uppercase font-semibold">
                                                    Booking Date
                                                </p>

                                                <p className="font-bold text-slate-800 mt-1">
                                                    {formatDate(booking.bookingDate)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-400 uppercase font-semibold">
                                                    Start Time
                                                </p>

                                                <p className="font-bold text-slate-800 mt-1">
                                                    {booking.startTime || "Not available"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-400 uppercase font-semibold">
                                                    Total Amount
                                                </p>

                                                <p className="font-bold text-slate-800 mt-1">
                                                    ₹{Number(getAmount(booking)).toLocaleString("en-IN")}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-400 uppercase font-semibold">
                                                    Payment
                                                </p>

                                                <p className="font-bold text-green-600 mt-1 capitalize">
                                                    {String(getPaymentStatus(booking))}
                                                </p>
                                            </div>

                                        </div>

                                        {/* Booking ID */}
                                        <div className="mt-5 bg-slate-50 rounded-xl p-4">

                                            <p className="text-xs text-slate-400 uppercase font-semibold">
                                                Booking ID
                                            </p>

                                            <p className="text-sm font-mono text-slate-700 mt-1 break-all">
                                                {booking._id || booking.id || "N/A"}
                                            </p>

                                        </div>

                                        {/* Actions */}
                                        <div className="mt-5 flex gap-3">

                                            <Link
                                                to="/"
                                                className="flex-1 text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition"
                                            >
                                                Book Again
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    cancelBooking(
                                                        booking._id || booking.id
                                                    )
                                                }
                                                disabled={
                                                    cancellingId ===
                                                    (booking._id || booking.id)
                                                }
                                                className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 font-bold py-3 rounded-xl transition disabled:opacity-50"
                                            >
                                                {cancellingId ===
                                                    (booking._id || booking.id)
                                                    ? "Cancelling..."
                                                    : "Cancel Booking"}
                                            </button>

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </main>

            <Footer />

        </div>
    );
};

export default MyBookings;