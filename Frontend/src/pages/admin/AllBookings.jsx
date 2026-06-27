import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import API from "../../services/api";
import toast from "react-hot-toast";

function AllBookings() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => { fetchAllBookings(); }, [])

    const fetchAllBookings = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await API.get("/bookings", { headers: { Authorization: `Bearer ${token}` } })
            setBookings(res.data.bookings);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch bookings");
        }
    };

    return (
        <>
            <Navbar />

            <section className="min-h-screen px-4 sm:px-6 lg:px-16 py-10">
                <div className="max-w-7xl mx-auto">

                    <div className="mb-10">
                        <p className="text-green-400 font-bold uppercase tracking-widest text-sm">
                            ArenaHub Admin
                        </p>

                        <h1 className="text-4xl md:text-5xl font-extrabold mt-2">
                            All Bookings
                        </h1>

                        <p className="text-slate-400 mt-3">
                            View customer details, booking status and payment information.
                        </p>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="bg-white rounded-3xl p-10 text-center shadow-xl">
                            <div className="text-5xl mb-4">📅</div>

                            <h2 className="text-2xl font-extrabold text-slate-900">
                                No bookings found
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Customer bookings will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {bookings.map((booking) => (
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

                                                <h2 className="text-2xl font-extrabold mt-2 wrap-break-word">
                                                    {booking.ground?.name || "Ground Deleted"}
                                                </h2>

                                                <p className="capitalize text-green-100 mt-1">
                                                    {booking.ground?.sportType || "N/A"}
                                                </p>
                                            </div>

                                            <span
                                                className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold capitalize ${booking.status === "booked"
                                                    ? "bg-white text-green-700"
                                                    : booking.status === "cancelled"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-blue-100 text-blue-700"
                                                    }`}
                                            >
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="bg-slate-50 rounded-2xl p-4 space-y-0">
                                            <div className="flex justify-between gap-4 py-2 border-b border-slate-200">
                                                <span className="text-slate-500">Customer</span>
                                                <span className="font-bold text-slate-900 text-right wrap-break-word">
                                                    {booking.customerName}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4 py-2 border-b border-slate-200">
                                                <span className="text-slate-500">Phone</span>
                                                <span className="font-semibold text-slate-800">
                                                    {booking.customerPhone}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4 py-2 border-b border-slate-200">
                                                <span className="text-slate-500">Email</span>
                                                <span className="font-semibold text-slate-800 text-right break-all">
                                                    {booking.customerEmail}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4 py-2 border-b border-slate-200">
                                                <span className="text-slate-500">Date</span>
                                                <span className="font-semibold text-slate-800">
                                                    {booking.bookingDate}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4 py-2 border-b border-slate-200">
                                                <span className="text-slate-500">Time</span>
                                                <span className="font-semibold text-slate-800">
                                                    {booking.startTime}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4 py-2 border-b border-slate-200">
                                                <span className="text-slate-500">Price</span>
                                                <span className="font-extrabold text-green-600">
                                                    ₹{booking.totalPrice}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center gap-4 py-2 border-b border-slate-200">
                                                <span className="text-slate-500">Status</span>

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${booking.status === "booked"
                                                        ? "bg-green-100 text-green-700"
                                                        : booking.status === "cancelled"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-blue-100 text-blue-700"
                                                        }`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center gap-4 py-2">
                                                <span className="text-slate-500">Payment</span>

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${booking.paymentStatus === "paid"
                                                        ? "bg-green-100 text-green-700"
                                                        : booking.paymentStatus === "failed"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {booking.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
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


export default AllBookings;