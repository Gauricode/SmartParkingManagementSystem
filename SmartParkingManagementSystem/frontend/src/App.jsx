import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Parking from "./pages/Parking";
import Bookings from "./pages/Bookings";
import Admin from "./pages/Admin";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";



function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/vehicles"
                    element={<Vehicles />}
                />

                <Route
                    path="/parking"
                    element={<Parking />}
                />

                <Route
                    path="/bookings"
                    element={<Bookings />}
                />

                <Route
                    path="/admin"
                    element={<Admin />}
                />

                <Route
                    path="/payment"
                    element={<Payment />}
                />

                <Route
                    path="/payment-success"
                    element={<PaymentSuccess />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;