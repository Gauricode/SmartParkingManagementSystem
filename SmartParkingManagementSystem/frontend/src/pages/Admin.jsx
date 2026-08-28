import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import {
    getAdminStats,
    getAdminUsers,
    getAdminBookings,
    getAdminSlots,
    getAdminPayments
} from "../services/api.js";


function Admin() {

    const [stats, setStats] = useState({});

    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [slots, setSlots] = useState([]);
    const [payments, setPayments] = useState([]);

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);


    // =====================================================
    // LOAD ADMIN DATA
    // =====================================================

    async function loadAdminData() {

        try {

            setLoading(true);

            const [
                statsData,
                usersData,
                bookingsData,
                slotsData,
                paymentsData
            ] = await Promise.all([

                getAdminStats(),

                getAdminUsers(),

                getAdminBookings(),

                getAdminSlots(),

                getAdminPayments()

            ]);


            setStats(statsData);

            setUsers(
                Array.isArray(usersData)
                    ? usersData
                    : []
            );

            setBookings(
                Array.isArray(bookingsData)
                    ? bookingsData
                    : []
            );

            setSlots(
                Array.isArray(slotsData)
                    ? slotsData
                    : []
            );

            setPayments(
                Array.isArray(paymentsData)
                    ? paymentsData
                    : []
            );

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to load admin data."
            );

        } finally {

            setLoading(false);
        }
    }


    useEffect(() => {

        loadAdminData();

    }, []);


    // =====================================================
    // ADMIN PAGE
    // =====================================================

    return (

        <div>

            <Navbar />

            <main>

                <h1>Admin Dashboard</h1>

                <p>
                    Smart Parking Management System
                </p>

                <hr />


                {message && (
                    <p>{message}</p>
                )}


                {loading ? (

                    <h2>
                        Loading dashboard...
                    </h2>

                ) : (

                    <>

                        {/* ================================= */}
                        {/* STATISTICS */}
                        {/* ================================= */}

                        <h2>System Overview</h2>

                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "15px"
                            }}
                        >

                            <div className="stat-card">
                                <h3>Users</h3>
                                <p>
                                    {stats.total_users ?? 0}
                                </p>
                            </div>


                            <div className="stat-card">
                                <h3>Vehicles</h3>
                                <p>
                                    {stats.total_vehicles ?? 0}
                                </p>
                            </div>


                            <div className="stat-card">
                                <h3>Total Slots</h3>
                                <p>
                                    {stats.total_slots ?? 0}
                                </p>
                            </div>


                            <div className="stat-card">
                                <h3>Available Slots</h3>
                                <p>
                                    {stats.available_slots ?? 0}
                                </p>
                            </div>


                            <div className="stat-card">
                                <h3>Total Bookings</h3>
                                <p>
                                    {stats.total_bookings ?? 0}
                                </p>
                            </div>


                            <div className="stat-card">
                                <h3>Active Bookings</h3>
                                <p>
                                    {stats.active_bookings ?? 0}
                                </p>
                            </div>


                            <div className="stat-card">
                                <h3>Total Revenue</h3>
                                <p>
                                    ₹{stats.total_revenue ?? 0}
                                </p>
                            </div>

                        </div>


                        <hr />


                        {/* ================================= */}
                        {/* USERS */}
                        {/* ================================= */}

                        <h2>Users</h2>

                        <table border="1" cellPadding="8">

                            <thead>

                                <tr>

                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>

                                </tr>

                            </thead>

                            <tbody>

                                {users.map((user) => (

                                    <tr key={user.user_id}>

                                        <td>
                                            {user.user_id}
                                        </td>

                                        <td>
                                            {user.name}
                                        </td>

                                        <td>
                                            {user.email}
                                        </td>

                                        <td>
                                            {user.role}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>


                        <hr />


                        {/* ================================= */}
                        {/* BOOKINGS */}
                        {/* ================================= */}

                        <h2>Bookings</h2>

                        <table border="1" cellPadding="8">

                            <thead>

                                <tr>

                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Vehicle</th>
                                    <th>Type</th>
                                    <th>Slot</th>
                                    <th>Date</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Status</th>

                                </tr>

                            </thead>

                            <tbody>

                                {bookings.map((booking) => (

                                    <tr
                                        key={booking.booking_id}
                                    >

                                        <td>
                                            {booking.booking_id}
                                        </td>

                                        <td>
                                            {booking.user_name}
                                        </td>

                                        <td>
                                            {booking.vehicle_number}
                                        </td>

                                        <td>
                                            {booking.vehicle_type}
                                        </td>

                                        <td>
                                            {booking.slot_number}
                                        </td>

                                        <td>
                                            {booking.booking_date}
                                        </td>

                                        <td>
                                            {booking.start_time}
                                        </td>

                                        <td>
                                            {booking.end_time}
                                        </td>

                                        <td>
                                            {booking.booking_status}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>


                        <hr />


                        {/* ================================= */}
                        {/* PARKING SLOTS */}
                        {/* ================================= */}

                        <h2>Parking Slots</h2>

                        <table border="1" cellPadding="8">

                            <thead>

                                <tr>

                                    <th>ID</th>
                                    <th>Slot</th>
                                    <th>Vehicle Type</th>
                                    <th>Status</th>

                                </tr>

                            </thead>

                            <tbody>

                                {slots.map((slot) => (

                                    <tr key={slot.slot_id}>

                                        <td>
                                            {slot.slot_id}
                                        </td>

                                        <td>
                                            {slot.slot_number}
                                        </td>

                                        <td>
                                            {slot.vehicle_type}
                                        </td>

                                        <td>
                                            {slot.status}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>


                        <hr />


                        {/* ================================= */}
                        {/* PAYMENTS */}
                        {/* ================================= */}

                        <h2>Payments</h2>

                        <table border="1" cellPadding="8">

                            <thead>

                                <tr>

                                    <th>ID</th>
                                    <th>Booking</th>
                                    <th>User</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Status</th>
                                    <th>Date</th>

                                </tr>

                            </thead>

                            <tbody>

                                {payments.map((payment) => (

                                    <tr key={payment.payment_id}>

                                        <td>
                                            {payment.payment_id}
                                        </td>

                                        <td>
                                            {payment.booking_id}
                                        </td>

                                        <td>
                                            {payment.user_name}
                                        </td>

                                        <td>
                                            ₹{payment.amount}
                                        </td>

                                        <td>
                                            {payment.payment_method}
                                        </td>

                                        <td>
                                            {payment.payment_status}
                                        </td>

                                        <td>
                                            {payment.payment_date}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </>

                )}

            </main>

        </div>
    );
}

export default Admin;