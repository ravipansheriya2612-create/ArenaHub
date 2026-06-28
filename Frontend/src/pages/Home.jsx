import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { Search, MapPin } from "lucide-react";

function Home() {

    const [grounds, setGrounds] = useState([]);
    const [search, setSearch] = useState("");
    const [ratings, setRatings] = useState({});

    useEffect(() => {
        fetchGrounds();
    }, []);

    const fetchGrounds = async () => {
        try {
            const response = await API.get("/grounds");
            setGrounds(response.data.grounds);
            fetchRatings(response.data.grounds);
        } catch (error) {
            console.error("Error fetching grounds:", error);
        }
    };

    const fetchRatings = async (groundsData) => {
        const ratingData = {};

        await Promise.all(
            groundsData.map(async (ground) => {
                try {
                    const res = await API.get(`/reviews/ground/${ground._id}`);

                    ratingData[ground._id] = {
                        avgRating: res.data.avgRating,
                        count: res.data.count,
                    };
                } catch (err) {
                    ratingData[ground._id] = {
                        avgRating: 0,
                        count: 0,
                    };
                }
            })
        );

        setRatings(ratingData);
    };

    const filteredGrounds = grounds.filter((ground) =>
        ground.name.toLowerCase().includes(search.toLowerCase()) ||
        ground.sportType.toLowerCase().includes(search.toLowerCase()) ||
        ground.address.toLowerCase().includes(search.toLowerCase())
    );

    const handleSearch = () => {
        console.log("Searching:", search);
    };

    return (
        <>
            <Navbar />

            <section className="bg-linear-to-r from-slate-900 to-green-800 text-white px-4 sm:px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
                        Book Your Favorite Sports Ground
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-green-100 max-w-2xl mx-auto">
                        Find and book cricket grounds, badminton courts, football turfs and more in just a few clicks.
                    </p>
                </div>
            </section>

            <section className="bg-slate-100 px-4 sm:px-6 md:px-10 lg:px-16 py-10 sm:py-12 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 sm:mb-10 text-center">
                        <p className="text-green-600 font-semibold uppercase tracking-widest text-sm">
                            ArenaHub
                        </p>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mt-2">
                            Available Sports Grounds
                        </h2>

                        <p className="text-slate-500 mt-3 text-sm sm:text-base">
                            Choose your ground and book your preferred time slot.
                        </p>
                    </div>

                    <div className="mb-8 max-w-xl mx-auto relative">
                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            placeholder="Search by ground, sport or address..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                            className="w-full border border-green-500 rounded-xl pl-12 pr-14 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-800"
                        />

                        <button
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition"
                        >
                            <Search size={18} />
                        </button>
                    </div>

                    {filteredGrounds.length === 0 ? (
                        <div className="text-center bg-white p-8 sm:p-10 rounded-2xl shadow">
                            <h3 className="text-lg sm:text-xl font-semibold text-slate-700">
                                No grounds available
                            </h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                            {filteredGrounds.map((ground) => (
                                <div
                                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border border-slate-200"
                                    key={ground._id}
                                >
                                    <div className="h-44 overflow-hidden">
                                        {ground.image ? (
                                            <img
                                                src={`${ground.image}?v=${ground.updatedAt}`} alt={ground.name}
                                                className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                            />
                                        ) : (
                                            <div className="h-full bg-linear-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                                                <h3 className="text-white text-2xl font-bold capitalize">
                                                    {ground.sportType}
                                                </h3>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 sm:p-6">
                                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 wrap-break-word">
                                            {ground.name}
                                        </h2>

                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-yellow-500">⭐</span>

                                            <span className="font-semibold text-slate-700">
                                                {ratings[ground._id]?.avgRating || "0.0"}
                                            </span>

                                            <span className="text-slate-500 text-sm">
                                                ({ratings[ground._id]?.count || 0} reviews)
                                            </span>
                                        </div>

                                        <p className="text-slate-600 mb-2 capitalize text-sm sm:text-base">
                                            <span className="font-semibold text-slate-800">Sport:</span>{" "}
                                            {ground.sportType}
                                        </p>

                                        <p className="text-slate-600 mb-2 text-sm sm:text-base">
                                            <span className="font-semibold text-slate-800">Price:</span>{" "}
                                            <span className="text-green-600 font-bold">
                                                ₹{ground.pricePerHour}/hour
                                            </span>
                                        </p>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-slate-600 mb-5">
                                            <p className="text-sm sm:text-base wrap-break-word">
                                                <span className="font-semibold text-slate-800">
                                                    Address:
                                                </span>{" "}
                                                {ground.address}
                                            </p>

                                            {ground.locationUrl && (
                                                <a
                                                    href={ground.locationUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium transition whitespace-nowrap text-sm sm:text-base"
                                                >
                                                    <MapPin size={18} />
                                                    <span>View Map</span>
                                                </a>
                                            )}
                                        </div>

                                        <Link to={`/grounds/${ground._id}`}>
                                            <button className="w-full bg-slate-900 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition text-sm sm:text-base">
                                                Book Now
                                            </button>
                                        </Link>
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

export default Home;
