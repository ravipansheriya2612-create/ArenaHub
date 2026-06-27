import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import API from "../../services/api";
import toast from "react-hot-toast";

function AddGround() {
    const [formData, setFormData] = useState({
        name: "",
        sportType: "",
        pricePerHour: "",
        address: "",
        city: "",
        locationUrl: "",
        image: "",
        description: "",
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const data = new FormData();

            data.append("name", formData.name);
            data.append("sportType", formData.sportType);
            data.append("pricePerHour", formData.pricePerHour);
            data.append("address", formData.address);
            data.append("city", formData.city);
            data.append("locationUrl", formData.locationUrl);
            data.append("description", formData.description);

            if (formData.image) {
                data.append("image", formData.image);
            }

            const res = await API.post("/grounds", data, { headers: { Authorization: `Bearer ${token}` } })

            toast.success(res.data.message || "Ground added successfully");

            setFormData({
                name: "",
                sportType: "",
                pricePerHour: "",
                address: "",
                city: "",
                locationUrl: "",
                image: "",
                description: "",
            })
        } catch (error) {
            console.log(error);
            toast.error("Failed to add ground");
        }
    }

    return (
        <>
            <Navbar />

            <section className="min-h-screen px-4 py-10">
                <div className="max-w-5xl mx-auto">

                    <div className="mb-8">
                        <p className="text-green-400 font-bold uppercase tracking-widest text-sm">
                            ArenaHub Admin
                        </p>

                        <h1 className="text-4xl md:text-5xl font-extrabold mt-2">
                            Add New Ground
                        </h1>

                        <p className="text-slate-400 mt-4">
                            Create a new sports ground and make it available for booking.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

                        <div className="bg-linear-to-r from-green-600 to-emerald-700 p-8 text-white">
                            <h2 className="text-3xl font-extrabold">
                                Ground Information
                            </h2>

                            <p className="text-green-100 mt-2">
                                Fill in the details below to add a new venue.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="p-6 md:p-8 space-y-6"
                        >
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Ground Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter ground name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Sport Type
                                    </label>

                                    <select
                                        value={formData.sportType}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                sportType: e.target.value,
                                            })
                                        }
                                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    >
                                        <option value="">Select Sport Type</option>
                                        <option value="cricket">Cricket</option>
                                        <option value="football">Football</option>
                                        <option value="badminton">Badminton</option>
                                        <option value="basketball">Basketball</option>
                                        <option value="tennis">Tennis</option>
                                        <option value="volleyball">Volleyball</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Price Per Hour (₹)
                                    </label>

                                    <input
                                        type="number"
                                        placeholder="500"
                                        value={formData.pricePerHour}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                pricePerHour: e.target.value,
                                            })
                                        }
                                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>

                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Address
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter full address"
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            address: e.target.value,
                                        })
                                    }
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Surat"
                                        value={formData.city}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                city: e.target.value,
                                            })
                                        }
                                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Google Map URL
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="https://maps.google.com/..."
                                        value={formData.locationUrl}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                locationUrl: e.target.value,
                                            })
                                        }
                                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Ground Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            image: e.target.files[0],
                                        })
                                    }
                                    className="w-full border border-dashed border-slate-300 rounded-xl px-4 py-4"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Description
                                </label>

                                <textarea
                                    rows="5"
                                    placeholder="Write something about the ground..."
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-linear-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg"
                            >
                                Add Ground
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );

}

export default AddGround;