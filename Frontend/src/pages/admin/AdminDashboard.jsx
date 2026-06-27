import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

function AdminDashboard() {
    return (
        <>
            <Navbar />

            <section className="min-h-screen px-6 py-10">
                <div className="max-w-7xl mx-auto">

                    <div className="mb-10 ">
                        <p className="text-green-400 font-bold uppercase tracking-widest text-sm">
                            ArenaHub Admin Panel
                        </p>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-black mt-2">
                            Dashboard
                        </h1>

                        <p className="text-black mt-3">
                            Manage grounds, bookings and platform activities.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">

                        <Link
                            to="/admin/add-ground"
                            className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center text-3xl mb-5">
                                ➕
                            </div>

                            <h2 className="text-2xl font-extrabold text-slate-900">
                                Add Ground
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Add new sports grounds and venues to ArenaHub.
                            </p>

                            <div className="mt-6 text-green-600 font-bold group-hover:translate-x-1 transition">
                                Open →
                            </div>
                        </Link>

                        <Link
                            to="/admin/grounds"
                            className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl mb-5">
                                🏟️
                            </div>

                            <h2 className="text-2xl font-extrabold text-slate-900">
                                Manage Grounds
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Edit, update or remove existing sports grounds.
                            </p>

                            <div className="mt-6 text-blue-600 font-bold group-hover:translate-x-1 transition">
                                Open →
                            </div>
                        </Link>

                        <Link
                            to="/admin/bookings"
                            className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-3xl mb-5">
                                📅
                            </div>

                            <h2 className="text-2xl font-extrabold text-slate-900">
                                All Bookings
                            </h2>

                            <p className="text-slate-500 mt-2">
                                View and manage all customer bookings.
                            </p>

                            <div className="mt-6 text-purple-600 font-bold group-hover:translate-x-1 transition">
                                Open →
                            </div>
                        </Link>

                    </div>

                    <div className="mt-10 bg-linear-to-r from-green-600 to-emerald-700 rounded-3xl p-8 text-white">
                        <h2 className="text-3xl font-extrabold">
                            Welcome Admin 👋
                        </h2>

                        <p className="mt-3 text-green-100 max-w-2xl">
                            Manage ArenaHub efficiently from one place. Add grounds,
                            track bookings and keep your sports booking platform running
                            smoothly.
                        </p>
                    </div>

                </div>
            </section>

            <Footer />
        </>
    );
}

export default AdminDashboard;