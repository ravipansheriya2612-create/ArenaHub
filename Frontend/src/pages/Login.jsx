import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const redirectPath = location.state?.from || "/";

    const handleLogin = async (e) => {
        e.preventDefault();

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
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition text-sm sm:text-base"
                        >
                            Login
                        </button>
                    </form>

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
