import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { getUserBookings, cancelBooking } from "../services/api.js";

function Bookings() {
    const rawUser = localStorage.getItem("user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    const userId = user?.user_id;

    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    function normalizeBookings(result) {
        if (Array.isArray(result)) return result;
        if (Array.isArray(result?.bookings)) return result.bookings;
        if (Array.isArray(result?.data)) return result.data;
        return [];
    }

    async function loadBookings() {
        if (!userId) {
            setBookings([]);
            setMessage("Please login first.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const result = await getUserBookings(userId);
            const normalized = normalizeBookings(result);

            if (normalized.length > 0) {
                setBookings(normalized);
                setMessage("");
                return;
            }

            if (result?.message) {
                setBookings([]);
                setMessage(result.message);
                return;
            }

            setBookings([]);
            setMessage("");
        } catch (error) {
            console.error(error);
            setBookings([]);
            setMessage("Unable to connect to server.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBookings();
    }, [userId]);

    async function handleCancel(bookingId) {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) return;

        try {
            const result = await cancelBooking(bookingId);
            setMessage(result.message || "Booking cancelled.");
            await loadBookings();
        } catch (error) {
            console.error(error);
            setMessage("Unable to cancel booking.");
        }
    }

    return (
        <div>
            <Navbar />

            <main style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
                <h1>My Bookings</h1>
                <p>View and manage your parking bookings.</p>
                <hr />

                {message && <p style={{ color: "#b42318" }}>{message}</p>}

                {loading ? (
                    <p>Loading bookings...</p>
                ) : bookings.length === 0 ? (
                    <p>You don't have any bookings yet.</p>
                ) : (
                    <div>
                        {bookings.map((booking) => {
                            const bookingStatus = String(
                                booking.booking_status || "Booked"
                            ).toUpperCase();

                            return (
                                <div
                                    key={booking.booking_id}
                                    style={{
                                        border: "1px solid #d0d5dd",
                                        borderRadius: "12px",
                                        padding: "20px",
                                        marginBottom: "15px",
                                        background: "#fff",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                                    }}
                                >
                                    <h2>Booking #{booking.booking_id}</h2>

                                    <p><strong>Vehicle:</strong> {booking.vehicle_number}</p>
                                    <p><strong>Vehicle Type:</strong> {booking.vehicle_type}</p>
                                    <p><strong>Parking Slot:</strong> {booking.slot_number}</p>
                                    <p><strong>Date:</strong> {booking.booking_date}</p>
                                    <p><strong>Time:</strong> {booking.start_time} - {booking.end_time}</p>
                                    <p><strong>Status:</strong> {booking.booking_status}</p>

                                    {bookingStatus !== "CANCELLED" && (
                                        <button
                                            onClick={() => handleCancel(booking.booking_id)}
                                            style={{
                                                background: "#d92d20",
                                                color: "#fff",
                                                border: "none",
                                                padding: "10px 16px",
                                                borderRadius: "8px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Cancel Booking
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Bookings;