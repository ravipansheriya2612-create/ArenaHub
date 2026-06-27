import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GroundDetails from "./pages/GroundDetails";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddGround from "./pages/admin/AddGround";
import ManageGrounds from "./pages/admin/ManageGrounds";
import EditGround from "./pages/admin/EditGround";
import AllBookings from "./pages/admin/AllBookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/grounds/:id" element={<GroundDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-ground" element={<AddGround />} />
        <Route path="/admin/grounds" element={<ManageGrounds />} />
        <Route path="/admin/edit-ground/:id" element={<EditGround />} />
        <Route path="/admin/bookings" element={<AllBookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;