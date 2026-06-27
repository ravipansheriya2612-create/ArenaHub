import { Link } from "react-router-dom";

function Footer() {
    return (

        <footer className="bg-slate-900 text-white mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 text-center sm:text-left">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-green-500">
                        ArenaHub
                    </h2>

                    <p className="text-gray-400 mt-3 text-sm sm:text-base leading-relaxed max-w-sm mx-auto sm:mx-0">
                        Book your favorite sports grounds quickly, securely and easily.
                    </p>
                </div>

                <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-3">
                        Quick Links
                    </h3>

                    <div className="flex flex-col gap-2 text-sm sm:text-base">
                        <Link to="/" className="text-gray-400 hover:text-green-400 transition">
                            Home
                        </Link>

                        <Link to="/my-bookings" className="text-gray-400 hover:text-green-400 transition">
                            My Bookings
                        </Link>

                        <Link to="/login" className="text-gray-400 hover:text-green-400 transition">
                            Login
                        </Link>

                        <Link to="/register" className="text-gray-400 hover:text-green-400 transition">
                            Register
                        </Link>
                    </div>
                </div>

                <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-3">
                        Sports
                    </h3>

                    <div className="flex flex-col gap-2 text-gray-400 text-sm sm:text-base">
                        <p>Cricket</p>
                        <p>Football</p>
                        <p>Badminton</p>
                        <p>Basketball</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-3">
                        Contact
                    </h3>

                    <div className="space-y-2 text-gray-400 text-sm sm:text-base wrap-break-word">
                        <p>Surat, Gujarat</p>

                        <a
                            href="mailto:support@arenahub.com"
                            className="block hover:text-green-400 transition"
                        >
                            support@arenahub.com
                        </a>

                        <a
                            href="tel:+919876543210"
                            className="block hover:text-green-400 transition"
                        >
                            +91 98765 43210
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-700 py-4 px-4 text-center text-gray-400 text-xs sm:text-sm">
                © {new Date().getFullYear()} ArenaHub. All rights reserved.
            </div>
        </footer>
    );

}

export default Footer;
