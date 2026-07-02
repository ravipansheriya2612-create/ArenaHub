import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import API from "../../services/api";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import toast from "react-hot-toast";

function ManageGrounds() {
    const [grounds, setGrounds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState("");

    useEffect(() => { fetchGrounds() }, []);

    const fetchGrounds = async () => {
        try {
            setLoading(true);

            const res = await API.get("/grounds");
            setGrounds(res.data.grounds);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch grounds");
        } finally {
            setLoading(false);
        }
    }

    const deleteGround = async (id) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this ground?");

            if (!confirmDelete) return;

            setDeleteLoading(id);

            const token = localStorage.getItem("token");

            await API.delete(`/grounds/${id}`, { headers: { Authorization: `Bearer ${token}` } })

            toast.success("Ground deleted successfully");
            setDeleteLoading("");
            setGrounds((prev) => prev.filter((ground) => ground._id !== id));
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to delete ground");
        } finally {
            setDeleteLoading("");
        }
    }

    return (
        <>
            <Navbar />

            <section className="min-h-screen px-4 py-10">
                <div className="max-w-7xl mx-auto">

                    <div className="mb-10">
                        <p className="text-green-400 font-bold uppercase tracking-widest text-sm">
                            ArenaHub Admin
                        </p>

                        <h1 className="text-4xl md:text-5xl font-extrabold mt-2">
                            Manage Grounds
                        </h1>

                        <p className="text-slate-400 mt-3">
                            Edit, update and delete all sports grounds from one place.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-5 text-slate-600 font-medium">
                                Loading grounds...
                            </p>
                        </div>
                    ) : grounds.length === 0 ? (
                        <div className="bg-white rounded-3xl p-10 text-center shadow-xl">
                            <div className="text-5xl mb-4">🏟️</div>

                            <h2 className="text-2xl font-extrabold text-slate-900">
                                No grounds found
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Add your first ground to start bookings.
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {grounds.map((ground) => (
                                <div
                                    key={ground._id}
                                    className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300 border border-slate-200"
                                >
                                    <div className="bg-linear-to-br from-green-500 to-emerald-700 p-6 text-white">
                                        <p className="text-green-100 text-sm font-semibold uppercase tracking-widest">
                                            Ground
                                        </p>

                                        <h2 className="text-2xl font-extrabold mt-2 wrap-break-word">
                                            {ground.name}
                                        </h2>

                                        <p className="capitalize text-green-100 mt-1">
                                            {ground.sportType}
                                        </p>
                                    </div>

                                    <div className="p-6">
                                        <div className="space-y-4 text-slate-700">
                                            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                                                <span className="text-slate-500">Price</span>
                                                <span className="font-extrabold text-green-600">
                                                    ₹{ground.pricePerHour}/hr
                                                </span>
                                            </div>

                                            <div className="border-b flex justify-between gap-5 border-slate-100 pb-3">
                                                <span className="text-slate-500 mb-1">Address : </span>

                                                <span>
                                                    {ground.address}
                                                    {ground.city && `, ${ground.city}`}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center gap-3">
                                                <span className="text-slate-500">Location</span>

                                                {ground.locationUrl ? (
                                                    <a
                                                        href={ground.locationUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-1 text-green-600 hover:text-green-700 font-bold whitespace-nowrap"
                                                    >
                                                        <MapPin size={18} />
                                                        View Map
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400 font-semibold">
                                                        Not added
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mt-6">
                                            <Link
                                                to={`/admin/edit-ground/${ground._id}`}
                                                className="text-center bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() => deleteGround(ground._id)}
                                                disabled={deleteLoading === ground._id}
                                                className={`py-3 rounded-xl font-bold transition ${deleteLoading === ground._id
                                                        ? "bg-red-300 cursor-not-allowed text-white"
                                                        : "bg-red-500 hover:bg-red-600 text-white"
                                                    }`}
                                            >
                                                {deleteLoading === ground._id ? "Deleting..." : "Delete"}
                                            </button>
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

export default ManageGrounds;