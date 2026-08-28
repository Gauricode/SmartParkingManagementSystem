import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";


function PaymentSuccess() {

    const location = useLocation();

    const navigate = useNavigate();


    const booking =
        location.state?.booking;

    const payment =
        location.state?.payment;


    if (!booking || !payment) {

        return (

            <div>

                <Navbar />

                <main className="page">

                    <div className="simple-card">

                        <h2>
                            Payment Information Not Found
                        </h2>

                        <button
                            className="btn-primary"
                            onClick={() =>
                                navigate("/bookings")
                            }
                        >
                            Go to My Bookings
                        </button>

                    </div>

                </main>

            </div>
        );
    }


    return (

        <div>

            <Navbar />

            <main className="page">

                <div className="page-header">

                    <p className="page-label">
                        PAYMENT
                    </p>

                    <h1>
                        Payment Successful
                    </h1>

                    <p>
                        Your payment has been recorded.
                    </p>

                </div>


                <div className="simple-card">

                    <div className="summary-list">


                        <div>

                            <span>
                                Payment ID
                            </span>

                            <strong>
                                PAY-
                                {String(
                                    payment.payment_id
                                ).padStart(6, "0")}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Booking ID
                            </span>

                            <strong>
                                #{booking.booking_id}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Amount
                            </span>

                            <strong>
                                ₹{payment.amount}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Payment Method
                            </span>

                            <strong>
                                {payment.payment_method}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Payment Status
                            </span>

                            <strong>
                                {payment.payment_status}
                            </strong>

                        </div>


                    </div>


                    <div
                        style={{
                            marginTop: "25px",
                            display: "flex",
                            gap: "10px"
                        }}
                    >

                        <button
                            className="btn-primary"
                            onClick={() =>
                                navigate(
                                    "/bookings"
                                )
                            }
                        >
                            View My Bookings
                        </button>


                        <button
                            className="btn-secondary"
                            onClick={() =>
                                navigate(
                                    "/dashboard"
                                )
                            }
                        >
                            Dashboard
                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
}


export default PaymentSuccess;