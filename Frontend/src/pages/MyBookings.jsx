import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

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
                    Authorization: `Bearer ${token} `,
                },
            });

            const fetchedBookings = res.data.bookings || [];

            // Latest booking first
            const sortedBookings = fetchedBookings.sort((a, b) => {
                const dateA = new Date(
                    `${a.bookingDate} ${a.startTime || "00:00"} `
                );

                const dateB = new Date(
                    `${b.bookingDate} ${b.startTime || "00:00"} `
                );

                return dateB - dateA;
            });

            setBookings(sortedBookings);
        } catch (error) {
            console.log(error);

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                toast.error("Session expired. Please login again.");
            } else {
                toast.error("Unable to load your bookings.");
            }
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmCancel) return;

        try {
            const token = localStorage.getItem("token");

            if (!token || token === "undefined") {
                toast.error("Please login again.");
                return;
            }

            await API.put(
                `/ bookings / cancel / ${id} `,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token} `,
                    },
                }
            );

            toast.success("Booking cancelled successfully.");

            fetchBookings();
        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to cancel booking."
            );
        }
    };

    const activeBookings = bookings.filter(
        (booking) =>
            booking.status !== "cancelled" &&
            booking.ground
    );

    return (
        <>
            <Navbar />

            <section className="min-h-screen bg-slate-100 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-12">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">

                        <div>
                            <p className="text-green-600 font-semibold uppercase tracking-wider text-sm">
                                ArenaHub
                            </p>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 mt-2">
                                My Bookings
                            </h1>

                            <p className="text-slate-500 mt-2">
                                Manage your upcoming and recent ground bookings.
                            </p>
                        </div>

                        {!loading && activeBookings.length > 0 && (
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold transition"
                            >
                                + Book Another Ground
                            </Link>
                        )}
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-28">

                            <div className="w-14 h-14 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>

                            <p className="mt-6 text-slate-700 font-semibold text-lg">
                                Loading your bookings...
                            </p>

                            <p className="text-sm text-slate-500 mt-2 text-center">
                                Please wait while we retrieve your booking details.
                            </p>
                        </div>
                    ) : activeBookings.length === 0 ? (

                        /* Empty State */
                        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 px-6 py-16 sm:px-10 text-center">

                            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl">
                                🏟️
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-6">
                                No bookings yet
                            </h2>

                            <p className="text-slate-500 max-w-lg mx-auto mt-3 leading-relaxed">
                                You don't have any active bookings right now.
                                Explore available sports grounds and book your
                                next game in just a few clicks.
                            </p>

                            <Link
                                to="/"
                                className="inline-flex items-center justify-center mt-7 bg-green-600 hover:bg-green-700 text-white px-7 py-3.5 rounded-xl font-bold transition shadow-md hover:shadow-lg"
                            >
                                Explore Sports Grounds
                            </Link>

                            <p className="text-xs text-slate-400 mt-5">
                                Find football, cricket, badminton and other
                                sports grounds near you.
                            </p>
                        </div>

                    ) : (

                        /* Booking List */
                        <div className="space-y-6">

                            {/* Latest Booking */}
                            <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
                                    ✓
                                </div>

                                <div>
                                    <p className="font-bold text-green-800">
                                        Your latest booking
                                    </p>

                                    <p className="text-sm text-green-700">
                                        Your most recently booked ground is shown first.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                {activeBookings.map((booking, index) => (

                                    <div
                                        key={booking._id}
                                        className={`bg - white rounded - 3xl overflow - hidden shadow - md hover: shadow - xl transition duration - 300 border ${index === 0
                                                ? "border-green-300 ring-2 ring-green-100"
                                                : "border-slate-200"
                                            } `}
                                    >

                                        {/* Latest Badge */}
                                        {index === 0 && (
                                            <div className="bg-green-600 text-white text-center py-2 text-sm font-bold">
                                                ⭐ Latest Booking
                                            </div>
                                        )}

                                        {/* Ground Image */}
                                        <div className="relative h-52 bg-slate-200">

                                            {booking.ground?.image ? (
                                                <img
                                                    src={booking.ground.image}
                                                    alt={booking.ground.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <span className="text-5xl">
                                                        🏟️
                                                    </span>
                                                </div>
                                            )}

                                            {/* Booking Status */}
                                            <span
                                                className={`absolute top - 4 right - 4 px - 4 py - 1.5 rounded - full text - xs font - bold capitalize shadow ${booking.status === "booked"
                                                        ? "bg-white text-green-700"
                                                        : "bg-blue-100 text-blue-700"
                                                    } `}
                                            >
                                                {booking.status}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">

                                            {/* Ground Name */}
                                            <div className="mb-6">

                                                <p className="text-xs font-bold uppercase tracking-widest text-green-600">
                                                    {booking.ground?.sportType || "Sports Ground"}
                                                </p>

                                                <h2 className="text-2xl font-extrabold text-slate-800 mt-1">
                                                    {booking.ground?.name}
                                                </h2>

                                                {booking.ground?.location && (
                                                    <p className="text-sm text-slate-500 mt-1">
                                                        📍 {booking.ground.location}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Booking Details */}
                                            <div className="grid grid-cols-2 gap-4">

                                                <div className="bg-slate-50 rounded-xl p-4">
                                                    <p className="text-xs text-slate-500">
                                                        Booking Date
                                                    </p>

                                                    <p className="font-bold text-slate-800 mt-1">
                                                        {booking.bookingDate}
                                                    </p>
                                                </div>

                                                <div className="bg-slate-50 rounded-xl p-4">
                                                    <p className="text-xs text-slate-500">
                                                        Start Time
                                                    </p>

                                                    <p className="font-bold text-slate-800 mt-1">
                                                        {booking.startTime}
                                                    </p>
                                                </div>

                                                <div className="bg-slate-50 rounded-xl p-4">
                                                    <p className="text-xs text-slate-500">
                                                        Total Price
                                                    </p>

                                                    <p className="font-extrabold text-green-600 mt-1 text-lg">
                                                        ₹{booking.totalPrice}
                                                    </p>
                                                </div>

                                                <div className="bg-slate-50 rounded-xl p-4">
                                                    <p className="text-xs text-slate-500">
                                                        Payment
                                                    </p>

                                                    <p
                                                        className={`font - bold capitalize mt - 1 ${booking.paymentStatus === "paid"
                                                                ? "text-green-600"
                                                                : "text-orange-500"
                                                            } `}
                                                    >
                                                        {booking.paymentStatus}
                                                    </p>
                                                </div>

                                            </div>

                                            {/* Actions */}
                                            {booking.status === "booked" && (
                                                <button
                                                    onClick={() =>
                                                        cancelBooking(booking._id)
                                                    }
                                                    className="w-full mt-6 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 py-3 rounded-xl font-bold transition"
                                                >
                                                    Cancel Booking
                                                </button>
                                            )}

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}

export default MyBookings;
