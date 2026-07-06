import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const redirectPath = location.state?.from || "/";

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            const res = await API.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            toast.success("Login Successful");

            navigate(redirectPath);

        } catch (error) {
            console.log(error);
            toast.error("Login Failed");
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
                            Welcome Back
                        </h1>

                        <p className="text-slate-500 mt-2 text-sm sm:text-base">
                            Login to continue booking your favorite grounds.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                        <div>
                            <label className="block mb-2 text-sm sm:text-base font-medium text-slate-700">
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                onChange={(e) => setEmail(e.target.value)}
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
                                placeholder="Enter your password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg font-semibold text-sm sm:text-base transition ${loading
                                ? "bg-green-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 text-white"
                                }`}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-6 bg-slate-100 rounded-xl p-5 border border-slate-200">
                        <h3 className="text-center text-lg font-bold text-slate-800 mb-4">
                            Demo Credentials
                        </h3>

                        {/* User */}
                        <div className="mb-5">
                            <p className="font-semibold text-blue-600 mb-2">
                                👤 Demo User
                            </p>

                            <div className="flex justify-between items-center bg-white rounded-lg px-3 py-2 mb-2">
                                <span className="text-sm break-all">
                                    demo@arenahub.com
                                </span>

                                <button
                                    type="button"
                                    onClick={() => copyToClipboard("demo@arenahub.com")}
                                    className="text-green-600 font-semibold hover:underline"
                                >
                                    Copy
                                </button>
                            </div>

                            <div className="flex justify-between items-center bg-white rounded-lg px-3 py-2">
                                <span className="text-sm">
                                    Demo@123
                                </span>

                                <button
                                    type="button"
                                    onClick={() => copyToClipboard("Demo@123")}
                                    className="text-green-600 font-semibold hover:underline"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        {/* Admin */}
                        <div>
                            <p className="font-semibold text-green-700 mb-2">
                                👨‍💼 Demo Admin
                            </p>

                            <div className="flex justify-between items-center bg-white rounded-lg px-3 py-2 mb-2">
                                <span className="text-sm break-all">
                                    admin@arenahub.com
                                </span>

                                <button
                                    type="button"
                                    onClick={() => copyToClipboard("admin@arenahub.com")}
                                    className="text-green-600 font-semibold hover:underline"
                                >
                                    Copy
                                </button>
                            </div>

                            <div className="flex justify-between items-center bg-white rounded-lg px-3 py-2">
                                <span className="text-sm">
                                    Admin@123
                                </span>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEmail("admin@arenahub.com");
                                        setPassword("Admin@123");
                                    }}
                                >
                                    Fill
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-slate-500 mt-6 text-sm sm:text-base">
                        Don't have an account?

                        <Link
                            to="/register"
                            className="text-green-600 font-semibold ml-1 hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </section>

            <Footer />

        </>
    );

};

export default Login;
