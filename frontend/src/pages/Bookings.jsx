import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import {
    getUserBookings,
    cancelBooking
} from "../services/api.js";

function Bookings() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const userId = user?.user_id;

    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);


    // =====================================================
    // LOAD BOOKINGS
    // =====================================================

    async function loadBookings() {

        if (!userId) {
            setMessage("Please login first.");
            setLoading(false);
            return;
        }

        try {

            setLoading(true);

            const result =
                await getUserBookings(userId);

            if (Array.isArray(result)) {

                setBookings(result);

            } else {

                setMessage(
                    result.message ||
                    "Unable to load bookings."
                );
            }

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to connect to server."
            );

        } finally {

            setLoading(false);
        }
    }


    useEffect(() => {
        loadBookings();
    }, [userId]);


    // =====================================================
    // CANCEL BOOKING
    // =====================================================

    async function handleCancel(bookingId) {

        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const result =
                await cancelBooking(bookingId);

            setMessage(
                result.message ||
                "Booking cancelled."
            );

            await loadBookings();

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to cancel booking."
            );
        }
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div>

            <Navbar />

            <main>

                <h1>My Bookings</h1>

                <p>
                    View and manage your parking bookings.
                </p>

                <hr />

                {message && (
                    <p>{message}</p>
                )}


                {loading ? (

                    <p>
                        Loading bookings...
                    </p>

                ) : bookings.length === 0 ? (

                    <p>
                        You don't have any bookings yet.
                    </p>

                ) : (

                    <div>

                        {bookings.map((booking) => (

                            <div
                                key={booking.booking_id}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "20px",
                                    marginBottom: "15px",
                                    maxWidth: "600px"
                                }}
                            >

                                <h2>
                                    Booking #
                                    {booking.booking_id}
                                </h2>

                                <p>
                                    <strong>
                                        Vehicle:
                                    </strong>{" "}
                                    {booking.vehicle_number}
                                </p>

                                <p>
                                    <strong>
                                        Vehicle Type:
                                    </strong>{" "}
                                    {booking.vehicle_type}
                                </p>

                                <p>
                                    <strong>
                                        Parking Slot:
                                    </strong>{" "}
                                    {booking.slot_number}
                                </p>

                                <p>
                                    <strong>
                                        Date:
                                    </strong>{" "}
                                    {booking.booking_date}
                                </p>

                                <p>
                                    <strong>
                                        Time:
                                    </strong>{" "}
                                    {booking.start_time}
                                    {" - "}
                                    {booking.end_time}
                                </p>

                                <p>
                                    <strong>
                                        Status:
                                    </strong>{" "}
                                    {booking.booking_status}
                                </p>


                                {booking.booking_status ===
                                "Booked" && (

                                    <button
                                        onClick={() =>
                                            handleCancel(
                                                booking.booking_id
                                            )
                                        }
                                    >
                                        Cancel Booking
                                    </button>

                                )}

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
}

export default Bookings;