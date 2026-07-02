import { useEffect, useState } from "react";
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

            if (!token) {
                setBookings([]);
                return;
            }

            const res = await API.get("/bookings/my-bookings", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setBookings(res.data.bookings);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        try {
            const confirmCancel = window.confirm(
                "Are you sure you want to cancel this booking?"
            );

            if (!confirmCancel) return;

            const token = localStorage.getItem("token");

            await API.put(
                `/bookings/cancel/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}`, } }
            );

            toast.success("Booking Cancelled");
            fetchBookings();

        } catch (error) {
            console.log(error);
            toast.error("Cancel booking failed");
        }

    };

    const activeBookings = bookings
        .filter((booking) => booking.status !== "cancelled")
        .filter((booking) => booking.ground);

    return (
        <>
            <Navbar />

            <section className="min-h-screen bg-slate-100 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 text-center sm:text-left">

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mt-2">
                            My Bookings
                        </h1>

                        <p className="text-slate-500 mt-2 text-sm sm:text-base">
                            View and manage your active sports ground bookings.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>

                            <p className="mt-5 text-slate-600 font-medium">
                                Loading your bookings...
                            </p>

                            <p className="text-sm text-slate-500 mt-2">
                                Server is starting. This may take a few seconds.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {activeBookings.map((booking) => (
                                <div
                                    key={booking._id}
                                    className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300 border border-slate-200"
                                >
                                    <div className="bg-linear-to-br from-green-500 to-emerald-700 p-6 text-white">
                                        <div className="flex justify-between items-start gap-3">
                                            <div>
                                                <p className="text-green-100 text-sm font-semibold uppercase tracking-widest">
                                                    Booking
                                                </p>

                                                <h3 className="text-2xl font-extrabold mt-2 wrap-break-word">
                                                    {booking.ground?.name || "Ground Deleted"}
                                                </h3>

                                                <p className="text-green-100 capitalize mt-1">
                                                    {booking.ground?.sportType || "N/A"}
                                                </p>
                                            </div>

                                            <span
                                                className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold capitalize ${booking.status === "booked"
                                                    ? "bg-white text-green-700"
                                                    : "bg-blue-100 text-blue-700"
                                                    }`}
                                            >
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="space-y-4 text-slate-700">
                                            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                                                <span className="text-slate-500">Date</span>
                                                <span className="font-bold">{booking.bookingDate}</span>
                                            </div>

                                            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                                                <span className="text-slate-500">Time</span>
                                                <span className="font-bold">{booking.startTime}</span>
                                            </div>

                                            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                                                <span className="text-slate-500">Price</span>
                                                <span className="font-extrabold text-green-600">
                                                    ₹{booking.totalPrice}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4">
                                                <span className="text-slate-500">Payment</span>
                                                <span className="font-bold capitalize">
                                                    {booking.paymentStatus}
                                                </span>
                                            </div>
                                        </div>

                                        {booking.status === "booked" && (
                                            <button
                                                onClick={() => cancelBooking(booking._id)}
                                                className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition"
                                            >
                                                Cancel Booking
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />

        </>
    );

};

export default MyBookings;
