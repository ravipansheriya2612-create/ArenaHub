import Navbar from "../components/Navbar";
import { useParams, useNavigate, useLocation, data } from "react-router-dom";
import API from "../services/api";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

function GroundDetails() {
  const { id } = useParams();

  const [ground, setGround] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", email: "", address: "" });
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
    aiComment: "",
  });
  const [loadingAI, setLoadingAI] = useState(false);

  const slots = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  useEffect(() => {
    fetchGroundDetails();
    fetchReviews();
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchGroundDetails = async () => {
    try {
      const response = await API.get(`/grounds/${id}`);
      setGround(response.data.ground);
    } catch (error) {
      console.error("Error fetching ground details:", error);
    }
  };

  const fetchBookedSlots = async (date) => {
    try {
      const res = await API.get(`/bookings/check?ground=${id}&date=${date}`);
      setBookedSlots(res.data.bookedSlots);
    } catch (error) {
      console.log(error);
    }
  };

  const submitReview = async (token) => {
    if (!reviewData.comment.trim()) return;

    await API.post(
      "/reviews",
      {
        ground: id,
        rating: reviewData.rating,
        comment: reviewData.comment,
        aiComment: reviewData.aiComment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const handleBooking = async () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!selectedDate) return toast.error("Please select a date");
    if (!selectedSlot) return toast.error("Please select a slot");

    if (!customerInfo.name.trim()) {
      return toast.error("Please enter your full name");
    }

    if (!phoneRegex.test(customerInfo.phone)) {
      return toast.error("Please enter a valid 10 digit Indian phone number");
    }

    if (!emailRegex.test(customerInfo.email)) {
      return toast.error("Please enter a valid email address");
    }

    if (!customerInfo.address.trim()) {
      return toast.error("Please enter your address");
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.setItem(
          "pendingBooking",
          JSON.stringify({
            ground: id,
            date: selectedDate,
            slot: selectedSlot,
          })
        );

        toast.error("Please login first");

        navigate("/login", {
          state: {
            from: location.pathname,
          },
        });

        return;
      }

      const loadingToast = toast.loading("Creating payment order...");

      const orderRes = await API.post(
        "/payments/create-order",
        { amount: ground.pricePerHour },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.dismiss(loadingToast);

      const options = {
        key: orderRes.data.key,
        amount: orderRes.data.order.amount,
        currency: "INR",
        name: "ArenaHub",
        description: "Ground Booking Payment",
        order_id: orderRes.data.order.id,

        handler: async function () {
          const bookingToast = toast.loading("Confirming booking...");

          try {
            await API.post(
              "/bookings",
              {
                ground: id,
                bookingDate: selectedDate,
                startTime: selectedSlot,
                endTime: selectedSlot,
                totalPrice: ground.pricePerHour,
                paymentStatus: "paid",
                customerName: customerInfo.name,
                customerPhone: customerInfo.phone,
                customerEmail: customerInfo.email,
                customerAddress: customerInfo.address,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (reviewData.comment.trim()) {
              await submitReview(token);
            }

            toast.success("Payment successful & booking confirmed", {
              id: bookingToast,
            });

            fetchBookedSlots(selectedDate);
            fetchReviews();

            setSelectedSlot("");
            setReviewData({
              rating: 5,
              comment: "",
              aiComment: "",
            });

            navigate("/my-bookings");
          } catch (error) {
            console.log(error);

            toast.error("Payment done but booking failed", {
              id: bookingToast,
            });
          }
        },

        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },

        notes: {
          ground: ground.name,
          date: selectedDate,
          slot: selectedSlot,
        },

        theme: {
          color: "#16a34a",
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error);
      toast.error("Unable to start payment");
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/ground/${id}`);

      setReviews(res.data.reviews);
      setAvgRating(res.data.avgRating);
    } catch (error) {
      console.log(error);
    }
  };

  const improveReview = async () => {
    try {
      if (!reviewData.comment.trim()) {
        return toast("Write a review first.");
      }

      setLoadingAI(true);

      const token = localStorage.getItem("token");

      const res = await API.post(
        "/ai/improve-review",
        { review: reviewData.comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviewData({
        ...reviewData,
        comment: res.data.improvedReview,
        aiComment: res.data.improvedReview,
      });

    } catch (error) {
      console.log(error);
      toast.error("AI failed");
    } finally {
      setLoadingAI(false);
    }
  };

  if (!ground) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center bg-slate-100">
          <h2 className="text-2xl font-semibold text-slate-700">Loading...</h2>
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-slate-100 px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            <div className="lg:col-span-2 space-y-6">

              <div className="relative h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
                {ground.image ? (
                  <img
                    src={ground.image}
                    alt={ground.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-r from-green-600 to-emerald-500 flex items-center justify-center">
                    <h2 className="text-white text-3xl font-bold capitalize">
                      {ground.sportType}
                    </h2>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/55"></div>

                <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-end text-white">
                  <p className="text-xs sm:text-sm uppercase tracking-widest text-green-300 font-semibold">
                    ArenaHub Booking
                  </p>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 wrap-break-word">
                    {ground.name}
                  </h1>

                  <p className="mt-2 text-sm sm:text-base text-slate-200 max-w-2xl">
                    {ground.description ||
                      "Book your preferred sports slot quickly and easily."}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-5">
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full flex items-center gap-2">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-bold text-white">
                        {Number(avgRating || 0).toFixed(1)}
                      </span>
                      <span className="text-slate-200 text-sm">
                        ({reviews.length} {reviews.length === 1 ? "Review" : "Reviews"})
                      </span>
                    </div>

                    <div className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full text-sm font-semibold capitalize">
                      {ground.sportType}
                    </div>

                    <div className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full text-sm font-semibold">
                      ₹{ground.pricePerHour}/hr
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-5 sm:p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Ground Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border rounded-xl p-4">
                    <p className="text-sm text-slate-500">Sport</p>
                    <p className="font-semibold capitalize text-slate-800">
                      {ground.sportType}
                    </p>
                  </div>

                  <div className="bg-slate-50 border rounded-xl p-4">
                    <p className="text-sm text-slate-500">Price</p>
                    <p className="font-bold text-green-600">
                      ₹{ground.pricePerHour}/hr
                    </p>
                  </div>

                  <div className="bg-slate-50 border rounded-xl p-4">
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="font-semibold text-slate-800 wrap-break-word">
                      {ground.address}
                      {ground.city && `, ${ground.city}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-5 sm:p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Select Date
                </h2>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    fetchBookedSlots(e.target.value);
                  }}
                  className="w-full sm:w-80 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-5 sm:p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Select Slot
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      disabled={bookedSlots.includes(slot)}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 rounded-xl font-semibold transition ${bookedSlots.includes(slot)
                        ? "bg-red-100 text-red-600 cursor-not-allowed"
                        : selectedSlot === slot
                          ? "bg-blue-600 text-white"
                          : "bg-green-100 text-green-700 hover:bg-green-600 hover:text-white"
                        }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
                  <span>🟢 Available</span>
                  <span>🔵 Selected</span>
                  <span>🔴 Booked</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-5 sm:p-6 h-fit lg:sticky lg:top-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Booking Summary
              </h2>

              <div className="space-y-2 text-slate-700 mb-6">
                <p><strong>Ground:</strong> {ground.name}</p>
                <p><strong>Date:</strong> {selectedDate || "Not selected"}</p>
                <p><strong>Slot:</strong> {selectedSlot || "Not selected"}</p>
                <p>
                  <strong>Total:</strong>{" "}
                  <span className="text-green-600 font-bold">
                    ₹{ground.pricePerHour}
                  </span>
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-800">
                  Customer Details
                </h3>

                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, name: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerInfo.phone}
                  maxLength="10"
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      phone: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={customerInfo.email}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, email: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <textarea
                  placeholder="Your Address"
                  value={customerInfo.address}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, address: e.target.value })
                  }
                  className="w-full min-h-24 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Review this Ground
                </h3>

                <select
                  value={reviewData.rating}
                  onChange={(e) =>
                    setReviewData({
                      ...reviewData,
                      rating: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4)</option>
                  <option value={3}>⭐⭐⭐ (3)</option>
                  <option value={2}>⭐⭐ (2)</option>
                  <option value={1}>⭐ (1)</option>
                </select>

                <textarea
                  rows={4}
                  placeholder="Write your review..."
                  value={reviewData.comment}
                  disabled={loadingAI}
                  onChange={(e) =>
                    setReviewData({
                      ...reviewData,
                      comment: e.target.value,
                      aiComment: "",
                    })
                  }
                  className={`w-full mt-4 border rounded-lg px-4 py-3 ${loadingAI ? "bg-slate-100 cursor-not-allowed" : "bg-white"
                    }`}
                />

                <button
                  type="button"
                  onClick={improveReview}
                  disabled={loadingAI || !reviewData.comment.trim()}
                  className={`mt-4 w-full py-3 rounded-lg font-semibold transition ${loadingAI || !reviewData.comment.trim()
                    ? "bg-purple-300 text-white cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                >
                  {loadingAI ? "Improving Review..." : "✨ Improve Review with AI"}
                </button>

                {reviewData.comment.trim() === "" && (
                  <p className="mt-2 text-sm text-slate-500">
                    Review is optional. Write one if you'd like AI to improve it.
                  </p>
                )}

                {reviewData.aiComment && (
                  <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
                    <p className="text-green-700 font-semibold">
                      ✅ AI improved your review
                    </p>

                    <p className="text-slate-700 mt-2">
                      {reviewData.aiComment}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleBooking}
                disabled={loadingAI}
                className={`w-full mt-6 py-3 rounded-xl font-semibold transition ${loadingAI
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-green-600 text-white"
                  }`}
              >
                {loadingAI ? "Please wait..." : "Pay & Confirm Booking"}
              </button>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );

};

export default GroundDetails;
