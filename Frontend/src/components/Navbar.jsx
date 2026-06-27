import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const storedUser = localStorage.getItem("user");
    const user = storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null;
        
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.success("Logged Out");
        window.location.href = "/";
    };

    return (
        <nav className="sticky top-0 z-50 bg-slate-900 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

                <div className="h-16 flex items-center justify-between">

                    <Link
                        to="/"
                        className="text-2xl font-bold text-green-500"
                    >
                        ArenaHub
                    </Link>

                    <button
                        className="lg:hidden text-white"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

                    <div className="hidden lg:flex items-center gap-8 text-base">

                        {user ? (
                            <>
                                <Link
                                    to="/"
                                    className="text-white hover:text-green-400 transition"
                                >
                                    Home
                                </Link>

                                <Link
                                    to="/my-bookings"
                                    className="text-white hover:text-green-400 transition"
                                >
                                    My Bookings
                                </Link>

                                {user.role === "admin" && (
                                    <Link
                                        to="/admin"
                                        className="text-yellow-400 hover:text-yellow-300 font-semibold"
                                    >
                                        Admin Panel
                                    </Link>
                                )}

                                <button
                                    onClick={logout}
                                    className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg text-white transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/"
                                    className="text-white hover:text-green-400 transition"
                                >
                                    Home
                                </Link>

                                <Link
                                    to="/login"
                                    className="text-white hover:text-green-400 transition"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg text-white transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}

                    </div>

                </div>

                {menuOpen && (
                    <div className="lg:hidden pb-5 border-t border-slate-700">

                        <div className="flex flex-col gap-4 mt-4">

                            {user ? (
                                <>
                                    <Link
                                        to="/"
                                        onClick={() => setMenuOpen(false)}
                                        className="text-white hover:text-green-400"
                                    >
                                        Home
                                    </Link>

                                    <Link
                                        to="/my-bookings"
                                        onClick={() => setMenuOpen(false)}
                                        className="text-white hover:text-green-400"
                                    >
                                        My Bookings
                                    </Link>

                                    {user.role === "admin" && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setMenuOpen(false)}
                                            className="text-yellow-400"
                                        >
                                            Admin Panel
                                        </Link>
                                    )}

                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            logout();
                                        }}
                                        className="bg-red-500 hover:bg-red-600 py-2 rounded-lg text-white"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/"
                                        onClick={() => setMenuOpen(false)}
                                        className="text-white"
                                    >
                                        Home
                                    </Link>

                                    <Link
                                        to="/login"
                                        onClick={() => setMenuOpen(false)}
                                        className="text-white"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/register"
                                        onClick={() => setMenuOpen(false)}
                                        className="bg-green-500 hover:bg-green-600 py-2 rounded-lg text-center text-white"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}

                        </div>

                    </div>
                )}

            </div>
        </nav>
    );

}

export default Navbar;
