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

            <section className="min-h-screen bg-slate-100 px-4 sm:px-6 md:px-8 lg:px-10 py-8 flex items-center justify-center">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Side - Register Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">

                        <div className="text-center mb-8">
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
                                Create Account
                            </h1>

                            <p className="text-slate-500 mt-2">
                                Join ArenaHub and start booking grounds.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div>
                                <label className="block mb-2 font-medium text-slate-700">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium text-slate-700">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium text-slate-700">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Create password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 rounded-lg font-semibold transition ${loading
                                        ? "bg-green-400 cursor-not-allowed text-white"
                                        : "bg-green-600 hover:bg-green-700 text-white"
                                    }`}
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>

                        </form>

                        <p className="text-center text-slate-500 mt-6">
                            Already have an account?

                            <Link
                                to="/login"
                                className="text-green-600 font-semibold ml-1 hover:underline"
                            >
                                Login
                            </Link>
                        </p>

                    </div>

                    {/* Right Side - Demo Card */}

                    <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-8 flex flex-col justify-center">

                        <h2 className="text-3xl font-bold text-green-400 text-center">
                            Want to Explore ArenaHub?
                        </h2>

                        <p className="text-slate-300 text-center mt-3 mb-8">
                            Skip registration and use our demo accounts to explore
                            the complete application.
                        </p>

                        <div className="space-y-5">

                            <div className="bg-white/10 rounded-xl p-5 border border-white/10">
                                <h3 className="font-bold text-blue-300 text-lg mb-3">
                                    👤 Demo User
                                </h3>

                                <p className="text-sm break-all">
                                    <span className="font-semibold">Email:</span>{" "}
                                    demo@arenahub.com
                                </p>

                                <p className="text-sm mt-2">
                                    <span className="font-semibold">
                                        Password:
                                    </span>{" "}
                                    Demo@123
                                </p>
                            </div>

                            <div className="bg-white/10 rounded-xl p-5 border border-white/10">
                                <h3 className="font-bold text-green-300 text-lg mb-3">
                                    👨‍💼 Demo Admin
                                </h3>

                                <p className="text-sm break-all">
                                    <span className="font-semibold">Email:</span>{" "}
                                    admin@arenahub.com
                                </p>

                                <p className="text-sm mt-2">
                                    <span className="font-semibold">
                                        Password:
                                    </span>{" "}
                                    Admin@123
                                </p>
                            </div>

                        </div>

                        <Link
                            to="/login"
                            className="mt-8 bg-green-600 hover:bg-green-700 text-center py-3 rounded-xl font-bold transition"
                        >
                            Login Using Demo Account
                        </Link>

                    </div>

                </div>
            </section>

            <Footer />
        </>
    );

};

export default Register;
