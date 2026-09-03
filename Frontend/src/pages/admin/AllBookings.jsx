import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import API from "../../services/api";
import toast from "react-hot-toast";

function AllBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");

    const fetchAllBookings = async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const token = localStorage.getItem("token");

            if (!token || token === "undefined") {
                toast.error("Session expired. Please login again.");
                return;
            }

            const res = await API.get("/bookings", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const fetchedBookings = res.data?.bookings || [];

            const sortedBookings = [...fetchedBookings].sort(
                (a, b) =>
                    new Date(b.createdAt || b.bookingDate) -
                    new Date(a.createdAt || a.bookingDate)
            );

            setBookings(sortedBookings);

        } catch (error) {
            console.error(
                "FETCH ALL BOOKINGS ERROR:",
                error.response?.data || error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch bookings"
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAllBookings();
    }, []);

    /* ---------------- HELPERS ---------------- */

    const getGround = (booking) => booking?.ground || {};

    const getGroundName = (booking) => {
        const ground = getGround(booking);

        return (
            ground.name ||
            booking.groundName ||
            "Ground Deleted"
        );
    };

    const getSportType = (booking) => {
        const ground = getGround(booking);

        return (
            ground.sportType ||
            booking.sportType ||
            "N/A"
        );
    };

    const getGroundLocation = (booking) => {
        const ground = getGround(booking);

        return (
            ground.location ||
            ground.address ||
            booking.location ||
            "Location not available"
        );
    };

    const getGroundImage = (booking) => {
        const ground = getGround(booking);

        if (ground.image) {
            return ground.image;
        }

        if (ground.imageUrl) {
            return ground.imageUrl;
        }

        if (
            Array.isArray(ground.images) &&
            ground.images.length > 0
        ) {
            return ground.images[0];
        }

        return "https://placehold.co/900x600?text=ArenaHub+Ground";
    };

    const formatDate = (date) => {
        if (!date) return "N/A";

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

    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString("en-IN");
    };

    const getStatusClass = (status) => {
        switch (String(status).toLowerCase()) {
            case "booked":
            case "confirmed":
                return "bg-green-100 text-green-700";

            case "cancelled":
                return "bg-red-100 text-red-700";

            case "completed":
                return "bg-blue-100 text-blue-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    const getPaymentClass = (status) => {
        switch (String(status).toLowerCase()) {
            case "paid":
                return "bg-green-100 text-green-700";

            case "failed":
                return "bg-red-100 text-red-700";

            case "refunded":
                return "bg-purple-100 text-purple-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    /* ---------------- FILTERING ---------------- */

    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const groundName = getGroundName(booking).toLowerCase();

            const customerName = String(
                booking.customerName || ""
            ).toLowerCase();

            const customerEmail = String(
                booking.customerEmail || ""
            ).toLowerCase();

            const customerPhone = String(
                booking.customerPhone || ""
            ).toLowerCase();

            const searchValue = search.toLowerCase().trim();

            const matchesSearch =
                !searchValue ||
                groundName.includes(searchValue) ||
                customerName.includes(searchValue) ||
                customerEmail.includes(searchValue) ||
                customerPhone.includes(searchValue);

            const matchesStatus =
                statusFilter === "all" ||
                String(booking.status).toLowerCase() ===
                statusFilter.toLowerCase();

            const matchesPayment =
                paymentFilter === "all" ||
                String(booking.paymentStatus).toLowerCase() ===
                paymentFilter.toLowerCase();

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPayment
            );
        });
    }, [
        bookings,
        search,
        statusFilter,
        paymentFilter,
    ]);

    /* ---------------- STATISTICS ---------------- */

    const totalBookings = bookings.length;

    const activeBookings = bookings.filter(
        (booking) =>
            !["cancelled", "completed"].includes(
                String(booking.status).toLowerCase()
            )
    ).length;

    const completedBookings = bookings.filter(
        (booking) =>
            String(booking.status).toLowerCase() ===
            "completed"
    ).length;

    const cancelledBookings = bookings.filter(
        (booking) =>
            String(booking.status).toLowerCase() ===
            "cancelled"
    ).length;

    const totalRevenue = bookings
        .filter(
            (booking) =>
                String(booking.paymentStatus).toLowerCase() ===
                "paid"
        )
        .reduce(
            (total, booking) =>
                total + Number(booking.totalPrice || 0),
            0
        );

    return (
        <div className="min-h-screen bg-slate-100">

            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* ================= HEADER ================= */}

                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">

                    <div>
                        <p className="text-green-600 font-bold uppercase tracking-[0.2em] text-sm">
                            ArenaHub Admin
                        </p>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-2">
                            All Bookings
                        </h1>

                        <p className="text-slate-500 mt-3 max-w-2xl">
                            Manage customer bookings, ground details,
                            payment status and booking activity from one place.
                        </p>
                    </div>

                    <button
                        onClick={() => fetchAllBookings(true)}
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition"
                    >
                        <span
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        >
                            ↻
                        </span>

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh Bookings"}
                    </button>

                </div>

                {/* ================= STATS ================= */}

                {!loading && (
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Total Bookings
                            </p>
                            <p className="text-3xl font-extrabold text-slate-900 mt-1">
                                {totalBookings}
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Active
                            </p>
                            <p className="text-3xl font-extrabold text-green-600 mt-1">
                                {activeBookings}
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Completed
                            </p>
                            <p className="text-3xl font-extrabold text-blue-600 mt-1">
                                {completedBookings}
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Cancelled
                            </p>
                            <p className="text-3xl font-extrabold text-red-600 mt-1">
                                {cancelledBookings}
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm col-span-2 lg:col-span-1">
                            <p className="text-sm text-slate-500">
                                Paid Revenue
                            </p>
                            <p className="text-2xl font-extrabold text-slate-900 mt-2">
                                ₹{formatPrice(totalRevenue)}
                            </p>
                        </div>

                    </div>
                )}

                {/* ================= FILTERS ================= */}

                {!loading && bookings.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-8">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            {/* Search */}
                            <div className="md:col-span-1">

                                <label className="block text-sm font-semibold text-slate-600 mb-2">
                                    Search
                                </label>

                                <div className="relative">

                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        🔍
                                    </span>

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Ground, customer, email or phone..."
                                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />

                                </div>

                            </div>

                            {/* Status */}
                            <div>

                                <label className="block text-sm font-semibold text-slate-600 mb-2">
                                    Booking Status
                                </label>

                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="all">
                                        All Statuses
                                    </option>
                                    <option value="booked">
                                        Booked
                                    </option>
                                    <option value="confirmed">
                                        Confirmed
                                    </option>
                                    <option value="completed">
                                        Completed
                                    </option>
                                    <option value="cancelled">
                                        Cancelled
                                    </option>
                                </select>

                            </div>

                            {/* Payment */}
                            <div>

                                <label className="block text-sm font-semibold text-slate-600 mb-2">
                                    Payment
                                </label>

                                <select
                                    value={paymentFilter}
                                    onChange={(e) =>
                                        setPaymentFilter(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="all">
                                        All Payments
                                    </option>
                                    <option value="paid">
                                        Paid
                                    </option>
                                    <option value="pending">
                                        Pending
                                    </option>
                                    <option value="failed">
                                        Failed
                                    </option>
                                    <option value="refunded">
                                        Refunded
                                    </option>
                                </select>

                            </div>

                        </div>

                        {(search ||
                            statusFilter !== "all" ||
                            paymentFilter !== "all") && (
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">

                                    <p className="text-sm text-slate-500">
                                        Showing{" "}
                                        <span className="font-bold text-slate-800">
                                            {filteredBookings.length}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-bold text-slate-800">
                                            {bookings.length}
                                        </span>{" "}
                                        bookings
                                    </p>

                                    <button
                                        onClick={() => {
                                            setSearch("");
                                            setStatusFilter("all");
                                            setPaymentFilter("all");
                                        }}
                                        className="text-sm font-bold text-green-600 hover:text-green-700"
                                    >
                                        Clear Filters
                                    </button>

                                </div>
                            )}

                    </div>
                )}

                {/* ================= LOADING ================= */}

                {loading && (
                    <div className="bg-white rounded-2xl border border-slate-200 py-24 text-center">

                        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />

                        <p className="mt-5 text-slate-700 font-bold">
                            Loading bookings...
                        </p>

                        <p className="text-sm text-slate-500 mt-2">
                            Fetching the latest booking information.
                        </p>

                    </div>
                )}

                {/* ================= EMPTY ================= */}

                {!loading &&
                    bookings.length === 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200 py-24 text-center">

                            <div className="text-6xl mb-5">
                                📅
                            </div>

                            <h2 className="text-2xl font-extrabold text-slate-900">
                                No bookings found
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Customer bookings will appear here.
                            </p>

                        </div>
                    )}

                {/* ================= NO FILTER RESULTS ================= */}

                {!loading &&
                    bookings.length > 0 &&
                    filteredBookings.length === 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200 py-20 text-center">

                            <div className="text-5xl mb-4">
                                🔎
                            </div>

                            <h2 className="text-2xl font-extrabold text-slate-900">
                                No matching bookings
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Try changing your search or filters.
                            </p>

                        </div>
                    )}

                {/* ================= BOOKINGS ================= */}

                {!loading &&
                    filteredBookings.length > 0 && (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-7">

                            {filteredBookings.map(
                                (booking, index) => {

                                    const ground =
                                        getGround(booking);

                                    return (
                                        <article
                                            key={
                                                booking._id ||
                                                booking.id ||
                                                index
                                            }
                                            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition duration-300"
                                        >

                                            {/* ===== GROUND IMAGE ===== */}

                                            <div className="relative h-64 bg-slate-200">

                                                <img
                                                    src={getGroundImage(
                                                        booking
                                                    )}
                                                    alt={getGroundName(
                                                        booking
                                                    )}
                                                    className="w-full h-full object-cover"
                                                    loading={
                                                        index > 1
                                                            ? "lazy"
                                                            : "eager"
                                                    }
                                                    onError={(
                                                        e
                                                    ) => {
                                                        e.currentTarget.src =
                                                            "https://placehold.co/900x600?text=ArenaHub+Ground";
                                                    }}
                                                />

                                                {/* Image Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                                {/* Latest */}
                                                {index === 0 &&
                                                    !search &&
                                                    statusFilter ===
                                                    "all" &&
                                                    paymentFilter ===
                                                    "all" && (
                                                        <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-extrabold px-3 py-2 rounded-full shadow">
                                                            LATEST BOOKING
                                                        </span>
                                                    )}

                                                {/* Booking Status */}
                                                <span
                                                    className={`absolute top-4 right-4 px-3 py-2 rounded-full text-xs font-extrabold uppercase ${getStatusClass(
                                                        booking.status
                                                    )}`}
                                                >
                                                    {booking.status ||
                                                        "N/A"}
                                                </span>

                                                {/* Ground Name */}
                                                <div className="absolute bottom-5 left-5 right-5 text-white">

                                                    <p className="text-sm font-bold text-green-300 uppercase tracking-wider">
                                                        {getSportType(
                                                            booking
                                                        )}
                                                    </p>

                                                    <h2 className="text-2xl font-extrabold mt-1">
                                                        {getGroundName(
                                                            booking
                                                        )}
                                                    </h2>

                                                    <p className="text-sm text-slate-200 mt-1">
                                                        📍{" "}
                                                        {getGroundLocation(
                                                            booking
                                                        )}
                                                    </p>

                                                </div>

                                            </div>

                                            {/* ===== CONTENT ===== */}

                                            <div className="p-6">

                                                {/* Customer */}
                                                <div className="mb-6">

                                                    <div className="flex items-center justify-between mb-3">

                                                        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                                                            Customer Details
                                                        </h3>

                                                        <span className="text-xs text-slate-400">
                                                            Booking
                                                        </span>

                                                    </div>

                                                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">

                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-slate-500">
                                                                Name
                                                            </span>

                                                            <span className="font-bold text-slate-900 text-right">
                                                                {booking.customerName ||
                                                                    "N/A"}
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-slate-500">
                                                                Phone
                                                            </span>

                                                            <span className="font-semibold text-slate-800">
                                                                {booking.customerPhone ||
                                                                    "N/A"}
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-slate-500">
                                                                Email
                                                            </span>

                                                            <span className="font-semibold text-slate-800 text-right break-all">
                                                                {booking.customerEmail ||
                                                                    "N/A"}
                                                            </span>
                                                        </div>

                                                    </div>

                                                </div>

                                                {/* Booking Details */}
                                                <div>

                                                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-3">
                                                        Booking Details
                                                    </h3>

                                                    <div className="grid grid-cols-2 gap-3">

                                                        <div className="border border-slate-200 rounded-xl p-4">
                                                            <p className="text-xs text-slate-400 font-bold uppercase">
                                                                Date
                                                            </p>

                                                            <p className="font-bold text-slate-900 mt-1">
                                                                {formatDate(
                                                                    booking.bookingDate
                                                                )}
                                                            </p>
                                                        </div>

                                                        <div className="border border-slate-200 rounded-xl p-4">
                                                            <p className="text-xs text-slate-400 font-bold uppercase">
                                                                Time
                                                            </p>

                                                            <p className="font-bold text-slate-900 mt-1">
                                                                {booking.startTime ||
                                                                    "N/A"}
                                                            </p>
                                                        </div>

                                                        <div className="border border-slate-200 rounded-xl p-4">
                                                            <p className="text-xs text-slate-400 font-bold uppercase">
                                                                Total Price
                                                            </p>

                                                            <p className="font-extrabold text-green-600 mt-1">
                                                                ₹
                                                                {formatPrice(
                                                                    booking.totalPrice
                                                                )}
                                                            </p>
                                                        </div>

                                                        <div className="border border-slate-200 rounded-xl p-4">
                                                            <p className="text-xs text-slate-400 font-bold uppercase">
                                                                Payment
                                                            </p>

                                                            <span
                                                                className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-extrabold capitalize ${getPaymentClass(
                                                                    booking.paymentStatus
                                                                )}`}
                                                            >
                                                                {booking.paymentStatus ||
                                                                    "Pending"}
                                                            </span>
                                                        </div>

                                                    </div>

                                                </div>

                                                {/* Booking ID */}
                                                <div className="mt-5 bg-slate-50 rounded-xl p-4">

                                                    <p className="text-xs text-slate-400 uppercase font-bold">
                                                        Booking ID
                                                    </p>

                                                    <p className="font-mono text-xs text-slate-700 mt-1 break-all">
                                                        {booking._id ||
                                                            booking.id ||
                                                            "N/A"}
                                                    </p>

                                                </div>

                                            </div>

                                        </article>
                                    );
                                }
                            )}

                        </div>
                    )}

            </main>

            <Footer />

        </div>
    );
}

export default AllBookings;