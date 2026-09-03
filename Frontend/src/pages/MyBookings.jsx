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
                    Authorization: `Bearer ${ token } `,
                },
            });

            const fetchedBookings = res.data.bookings || [];

            // Latest booking first
            const sortedBookings = [...fetchedBookings].sort((a, b) => {
                const dateA = new Date(
                    `${ a.bookingDate } ${ a.startTime || "00:00" } `
                );

                const dateB = new Date(
                    `${ b.bookingDate } ${ b.startTime || "00:00" } `
                );

                return dateB - dateA;
            });

            setBookings(sortedBookings);
        } catch (error) {
            console.log(error);

            if (error.response?.status === 401) {
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
                `/ bookings / cancel / ${ id } `,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${ token } `,
                    },
                }
            );

            toast.success("Booking cancelled successfully.");

            fetchBookings();
        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Cancel booking failed."
            );
        }
    };

    // Only active bookings
    const activeBookings = bookings.filter(
        (booking) =>
            booking.status !== "cancelled" &&
            booking.ground
    );

    return (
        <>
            <Navbar />

            <section className="min-h-screen bg-slate-100 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-10">
                <div className="max-w-7xl mx-auto">

                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">

                        <div>
                            <p className="text-green-600 font-bold text-sm uppercase tracking-widest">
                                ArenaHub
                            </p>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 mt-2">
                                My Bookings
                            </h1>

                            <p className="text-slate-500 mt-2">
                                View and manage all your sports ground bookings.
                            </p>
                        </div>

                        <Link
                            to="/"
                            className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-bold transition shadow-sm"
                        >
                            + Book Another Ground
                        </Link>
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="bg-white rounded-3xl shadow-md border border-slate-200 py-24 flex flex-col items-center justify-center">

                            <div className="w-14 h-14 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>

                            <p className="mt-6 text-slate-700 font-semibold text-lg">
                                Loading your bookings...
                            </p>

                            <p className="text-sm text-slate-500 mt-2">
                                Fetching your latest booking details.
                            </p>
                        </div>
                    ) : activeBookings.length === 0 ? (

                        /* Empty State */
                        <div className="bg-white rounded-3xl shadow-md border border-slate-200 py-20 px-6 text-center">

                            <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center text-5xl">
                                🏟️
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-6">
                                No bookings found
                            </h2>

                            <p className="max-w-xl mx-auto text-slate-500 mt-3 leading-relaxed">
                                You haven't booked any sports ground yet.
                                Explore available grounds, choose your preferred
                                date and time, and make your first booking.
                            </p>

                            <Link
                                to="/"
                                className="inline-flex mt-7 bg-green-600 hover:bg-green-700 text-white px-7 py-3.5 rounded-xl font-bold transition shadow-md"
                            >
                                Explore Sports Grounds
                            </Link>
                        </div>

                    ) : (

                        /* Bookings */
                        <div className="space-y-6">

                            {/* Booking Count */}
                            <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Active Bookings
                                    </p>

                                    <p className="text-2xl font-extrabold text-slate-800">
                                        {activeBookings.length}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-slate-500">
                                        Latest booking
                                    </p>

                                    <p className="font-bold text-green-600">
                                        {activeBookings[0]?.ground?.name}
                                    </p>
                                </div>
                            </div>

                            {/* Booking Cards */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">

                                {activeBookings.map((booking, index) => {

                                    const isLatest = index === 0;

                                    return (
                                        <div
                                            key={booking._id}
                                            className={`bg - white rounded - 3xl overflow - hidden border shadow - md hover: shadow - xl transition duration - 300 ${
    isLatest
        ? "border-green-300 ring-2 ring-green-100"
        : "border-slate-200"
} `}
                                        >

                                            {/* Latest Booking */}
                                            {isLatest && (
                                                <div className="bg-green-600 text-white text-center py-2.5 text-sm font-bold tracking-wide">
                                                    ⭐ Latest Booking
                                                </div>
                                            )}

                                            {/* Ground Image */}
                                            <div className="relative h-60 bg-slate-200">

                                                {booking.ground?.image ? (
                                                    <img
                                                        src={booking.ground.image}
                                                        alt={booking.ground.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                                        <span className="text-6xl">
                                                            🏟️
                                                        </span>

                                                        <p className="text-sm mt-2">
                                                            Ground image unavailable
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Booking Status */}
                                                <div className="absolute top-4 right-4">
                                                    <span
                                                        className={`px - 4 py - 2 rounded - full text - xs font - bold capitalize shadow - lg ${
    booking.status === "booked"
        ? "bg-white text-green-700"
        : "bg-blue-100 text-blue-700"
} `}
                                                    >
                                                        {booking.status}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Booking Information */}
                                            <div className="p-6">

                                                {/* Ground Details */}
                                                <div className="pb-5 border-b border-slate-200">

                                                    <p className="text-xs uppercase tracking-widest font-bold text-green-600">
                                                        {booking.ground?.sportType || "Sports Ground"}
                                                    </p>

                                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">
                                                        {booking.ground?.name || "Ground Unavailable"}
                                                    </h2>

                                                    {booking.ground?.location && (
                                                        <p className="text-sm text-slate-500 mt-2">
                                                            📍 {booking.ground.location}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Booking Details */}
                                                <div className="grid grid-cols-2 gap-4 mt-5">

                                                    {/* Date */}
                                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                        <p className="text-xs font-medium text-slate-500">
                                                            Booking Date
                                                        </p>

                                                        <p className="font-bold text-slate-800 mt-1">
                                                            📅 {booking.bookingDate}
                                                        </p>
                                                    </div>

                                                    {/* Time */}
                                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                        <p className="text-xs font-medium text-slate-500">
                                                            Start Time
                                                        </p>

                                                        <p className="font-bold text-slate-800 mt-1">
                                                            🕐 {booking.startTime}
                                                        </p>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                        <p className="text-xs font-medium text-slate-500">
                                                            Total Amount
                                                        </p>

                                                        <p className="font-extrabold text-green-600 text-lg mt-1">
                                                            ₹{booking.totalPrice}
                                                        </p>
                                                    </div>

                                                    {/* Payment */}
                                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                        <p className="text-xs font-medium text-slate-500">
                                                            Payment Status
                                                        </p>

                                                        <p
                                                            className={`font - bold capitalize mt - 1 ${
    booking.paymentStatus === "paid"
        ? "text-green-600"
        : booking.paymentStatus === "pending"
            ? "text-orange-500"
            : "text-slate-600"
} `}
                                                        >
                                                            {booking.paymentStatus}
                                                        </p>
                                                    </div>

                                                </div>

                                                {/* Booking ID */}
                                                <div className="mt-5 bg-slate-50 rounded-xl px-4 py-3 flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">
                                                        Booking ID
                                                    </span>

                                                    <span className="text-xs font-mono font-semibold text-slate-700">
                                                        {booking._id}
                                                    </span>
                                                </div>

                                                {/* Cancel */}
                                                {booking.status === "booked" && (
                                                    <button
                                                        onClick={() =>
                                                            cancelBooking(
                                                                booking._id
                                                            )
                                                        }
                                                        className="w-full mt-5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 hover:text-red-700 py-3 rounded-xl font-bold transition"
                                                    >
                                                        Cancel Booking
                                                    </button>
                                                )}

                                            </div>
                                        </div>
                                    );
                                })}
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