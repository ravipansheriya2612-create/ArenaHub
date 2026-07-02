import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

function Register() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            const res = await API.post("/auth/register", formData);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            toast.success(res.data.message || "Registration Successful");
            navigate("/");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Registration Failed");
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Navbar />

            <section className="min-h-screen bg-slate-100 px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 flex items-center justify-center">
                <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-7 md:p-8">
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800">
                            Create Account
                        </h1>

                        <p className="text-slate-500 mt-2 text-sm sm:text-base">
                            Join ArenaHub and start booking grounds.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                        <div>
                            <label className="block mb-2 text-sm sm:text-base font-medium text-slate-700">
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your name"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm sm:text-base font-medium text-slate-700">
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm sm:text-base font-medium text-slate-700">
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Create password"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg font-semibold text-sm sm:text-base transition ${loading
                                    ? "bg-green-400 cursor-not-allowed text-white"
                                    : "bg-green-600 hover:bg-green-700 text-white"
                                }`}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 mt-6 text-sm sm:text-base">
                        Already have an account?

                        <Link
                            to="/login"
                            className="text-green-600 font-semibold ml-1 hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </section>

            <Footer />

        </>
    );

};

export default Register;
