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
                email: email.trim().toLowerCase(),
                password,
            });

            console.log("LOGIN RESPONSE:", res.data);
            console.log("TOKEN:", res.data?.token);

            if (!res.data?.token) {
                toast.error("Login failed: Token not received");
                console.error("JWT token missing from login response");
                return;
            }

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            console.log("TOKEN STORED:", localStorage.getItem("token"));

            toast.success("Login Successful");

            navigate(redirectPath);
        } catch (error) {
            console.log("Login Status:", error.response?.status);
            console.log("Login Response:", error.response?.data);

            toast.error(
                error.response?.data?.message || "Login Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <section className="min-h-screen bg-slate-100 px-4 sm:px-6 md:px-8 lg:px-10 py-8 flex items-center justify-center">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Side - Login Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">

                        <div className="text-center mb-8">
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
                                Welcome Back
                            </h1>

                            <p className="text-slate-500 mt-2">
                                Login to continue booking your favorite grounds.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">

                            <div>
                                <label className="block mb-2 font-medium text-slate-700">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium text-slate-700">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                {loading ? "Logging in..." : "Login"}
                            </button>

                        </form>

                        <p className="text-center text-slate-500 mt-6">
                            Don't have an account?

                            <Link
                                to="/register"
                                className="text-green-600 font-semibold ml-1 hover:underline"
                            >
                                Register
                            </Link>
                        </p>

                    </div>

                    {/* Right Side - Demo Card */}

                    <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-8 flex flex-col justify-center">

                        <h2 className="text-3xl font-bold text-green-400 text-center">
                            Demo Credentials
                        </h2>

                        <p className="text-slate-300 text-center mt-3 mb-8">
                            HRs and interviewers can explore the complete ArenaHub application using these demo accounts.
                        </p>

                        <div className="space-y-6">

                            {/* Demo User */}

                            <div className="bg-white/10 border border-white/10 rounded-xl p-5">

                                <h3 className="text-lg font-bold text-blue-300 mb-3">
                                    👤 Demo User
                                </h3>

                                <p className="text-sm break-all">
                                    <span className="font-semibold">Email:</span>{" "}
                                    demo@arenahub.com
                                </p>

                                <p className="text-sm mt-2">
                                    <span className="font-semibold">Password:</span>{" "}
                                    Demo@123
                                </p>

                                <div className="grid grid-cols-2 gap-3 mt-5">

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEmail("demo@arenahub.com");
                                            setPassword("Demo@123");
                                        }}
                                        className="bg-blue-500 hover:bg-blue-600 py-2 rounded-lg font-semibold"
                                    >
                                        Fill
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            copyToClipboard("demo@arenahub.com")
                                        }
                                        className="bg-slate-700 hover:bg-slate-600 py-2 rounded-lg font-semibold"
                                    >
                                        Copy Email
                                    </button>

                                </div>

                            </div>

                            {/* Demo Admin */}

                            <div className="bg-white/10 border border-white/10 rounded-xl p-5">

                                <h3 className="text-lg font-bold text-green-300 mb-3">
                                    👨‍💼 Demo Admin
                                </h3>

                                <p className="text-sm break-all">
                                    <span className="font-semibold">Email:</span>{" "}
                                    admin@arenahub.com
                                </p>

                                <p className="text-sm mt-2">
                                    <span className="font-semibold">Password:</span>{" "}
                                    Admin@123
                                </p>

                                <div className="grid grid-cols-2 gap-3 mt-5">

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEmail("admin@arenahub.com");
                                            setPassword("Admin@123");
                                        }}
                                        className="bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold"
                                    >
                                        Fill
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            copyToClipboard("admin@arenahub.com")
                                        }
                                        className="bg-slate-700 hover:bg-slate-600 py-2 rounded-lg font-semibold"
                                    >
                                        Copy Email
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </section>

            <Footer />
        </>
    );

};

export default Login;
