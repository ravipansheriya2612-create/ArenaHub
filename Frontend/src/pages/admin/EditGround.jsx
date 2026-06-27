import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import API from "../../services/api";
import { Eye } from "lucide-react";
import toast from "react-hot-toast";

function EditGround() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [previewImage, setPreviewImage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        sportType: "",
        pricePerHour: "",
        address: "",
        city: "",
        locationUrl: "",
        image: "",
        description: "",
    });

    useEffect(() => { fetchGround() }, []);

    const fetchGround = async () => {
        try {
            const res = await API.get(`/grounds/${id}`);
            setFormData(res.data.ground)
            setPreviewImage(res.data.ground.image);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch ground");
        }
    };

    const handleUpdate = async (e) => {
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

            if (formData.image instanceof File) {
                data.append("image", formData.image);
            }

            await API.put(`/grounds/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Ground updated successfully");
            navigate("/admin/grounds", { replace: true });
        } catch (error) {
            console.log(error);
            toast.error("Failed to update ground");
        }
    };

    return (
        <>
            <Navbar />

            <section className="min-h-screen px-4 py-10">
                <div className="max-w-5xl mx-auto">

                    <div className="mb-8">
                        <p className="text-blue-400 font-bold uppercase tracking-widest text-sm">
                            ArenaHub Admin
                        </p>

                        <h1 className="text-4xl md:text-5xl font-extrabold mt-2">
                            Edit Ground
                        </h1>

                        <p className="text-slate-400 mt-3">
                            Update ground information, pricing and location details.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

                        <div className="bg-linear-to-r from-blue-600 to-cyan-600 p-8 text-white">
                            <h2 className="text-3xl font-extrabold">
                                Ground Details
                            </h2>

                            <p className="text-blue-100 mt-2">
                                Modify the information below and save changes.
                            </p>
                        </div>

                        <form
                            onSubmit={handleUpdate}
                            className="p-6 md:p-8 space-y-6"
                        >
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Ground Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Ground Name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Sport Type</option>
                                        <option value="cricket">Cricket</option>
                                        <option value="football">Football</option>
                                        <option value="badminton">Badminton</option>
                                        <option value="basketball">Basketball</option>
                                        <option value="tennis">Tennis</option>
                                        <option value="volleyball">Volleyball</option>
                                        <option value="hockey">Hockey</option>
                                        <option value="rugby">Rugby</option>
                                        <option value="swimming">Swimming</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Price Per Hour (₹)
                                    </label>

                                    <input
                                        type="number"
                                        placeholder="Price Per Hour"
                                        value={formData.pricePerHour}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                pricePerHour: e.target.value,
                                            })
                                        }
                                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            address: e.target.value,
                                        })
                                    }
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                city: e.target.value,
                                            })
                                        }
                                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Google Map URL
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Google Map URL"
                                        value={formData.locationUrl || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                locationUrl: e.target.value,
                                            })
                                        }
                                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                            </div>

                            {previewImage && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Preview Image
                                    </label>

                                    <img
                                        src={previewImage}
                                        alt="Ground Preview"
                                        className="w-full h-64 object-cover rounded-2xl border shadow-md"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Upload New Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];

                                        setFormData({
                                            ...formData,
                                            image: file,
                                        });

                                        setPreviewImage(URL.createObjectURL(file));
                                    }}
                                    className="w-full border border-dashed border-slate-300 rounded-xl px-4 py-4"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Description
                                </label>

                                <textarea
                                    rows="5"
                                    placeholder="Description"
                                    value={formData.description || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg"
                            >
                                Update Ground
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );

};

export default EditGround;