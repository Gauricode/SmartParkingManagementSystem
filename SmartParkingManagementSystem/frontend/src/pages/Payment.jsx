import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";

import {
    createPayment
} from "../services/api.js";


const HOURLY_RATE = 20;


/* =========================================
   CALCULATE PARKING CHARGE
========================================= */

function calculateAmount(startTime, endTime) {

    const [startHour, startMinute] =
        startTime.split(":").map(Number);

    const [endHour, endMinute] =
        endTime.split(":").map(Number);


    const startMinutes =
        startHour * 60 + startMinute;

    const endMinutes =
        endHour * 60 + endMinute;


    const durationMinutes =
        endMinutes - startMinutes;


    if (durationMinutes <= 0) {
        return 0;
    }


    /*
        Charge for every started hour.

        Example:

        1 hour       → ₹20
        1.5 hours    → ₹40
        2 hours      → ₹40
        2.5 hours    → ₹60
    */

    const hours = Math.ceil(
        durationMinutes / 60
    );


    return hours * HOURLY_RATE;
}


function Payment() {

    const location = useLocation();

    const navigate = useNavigate();


    const booking =
        location.state?.booking;


    const [paymentMethod, setPaymentMethod] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");


    /* =========================================
       CALCULATE AMOUNT
    ========================================= */

    const amount = booking
        ? calculateAmount(
            booking.start_time,
            booking.end_time
        )
        : 0;


    /* =========================================
       NO BOOKING
    ========================================= */

    if (!booking) {

        return (

            <div>

                <Navbar />

                <main className="page">

                    <div className="page-header">

                        <p className="page-label">
                            PAYMENT
                        </p>

                        <h1>
                            Payment
                        </h1>

                        <p>
                            No booking information was found.
                        </p>

                    </div>


                    <div className="simple-card">

                        <p>
                            Please create a booking
                            before making a payment.
                        </p>

                        <button
                            className="btn-primary"
                            onClick={() =>
                                navigate("/parking")
                            }
                        >
                            Go to Parking
                        </button>

                    </div>

                </main>

            </div>
        );
    }


    /* =========================================
       INVALID DURATION
    ========================================= */

    if (amount <= 0) {

        return (

            <div>

                <Navbar />

                <main className="page">

                    <div className="page-header">

                        <p className="page-label">
                            PAYMENT
                        </p>

                        <h1>
                            Invalid Booking
                        </h1>

                        <p>
                            The booking time is invalid.
                        </p>

                    </div>


                    <div className="simple-card">

                        <button
                            className="btn-primary"
                            onClick={() =>
                                navigate("/parking")
                            }
                        >
                            Back to Parking
                        </button>

                    </div>

                </main>

            </div>
        );
    }


    /* =========================================
       PROCESS PAYMENT
    ========================================= */

    async function handlePayment() {

        setMessage("");


        if (!paymentMethod) {

            setMessage(
                "Please select a payment method."
            );

            return;
        }


        try {

            setLoading(true);


            // The backend calculates the final amount from
            // the booking duration. Do not send a user-editable amount.

            const paymentData = {

                booking_id:
                    Number(
                        booking.booking_id
                    ),

                amount:
                    Number(amount),

                payment_method:
                    paymentMethod

            };


            console.log(
                "PAYMENT DATA:",
                paymentData
            );


            const result =
                await createPayment(
                    paymentData
                );


            console.log(
                "PAYMENT RESPONSE:",
                result
            );


            if (result?.payment_id) {

                /*
                    Build payment information
                    for the success screen.
                */

                const paymentInfo = {

                    payment_id:
                        result.payment_id,

                    booking_id:
                        booking.booking_id,

                    amount:
                        result.amount ?? amount,

                    payment_method:
                        result.payment_method ??
                        paymentMethod,

                    payment_status:
                        result.payment_status

                };


                /*
                    Store temporarily so the
                    bookings page can use it later
                    if required.
                */

                localStorage.setItem(
                    "lastPayment",
                    JSON.stringify(
                        paymentInfo
                    )
                );


                /*
                    Go to payment success page.
                */

                navigate(
                    "/payment-success",
                    {
                        state: {
                            booking:
                                booking,

                            payment:
                                paymentInfo
                        }
                    }
                );


            } else {

                setMessage(
                    result?.message ||
                    "Payment could not be completed."
                );

            }


        } catch (error) {

            console.error(
                "PAYMENT ERROR:",
                error
            );


            const response =
                error.response?.data;


            if (response?.error) {

                setMessage(
                    `${response.message || "Payment failed"}: ${response.error}`
                );

            } else if (response?.message) {

                setMessage(
                    response.message
                );

            } else {

                setMessage(
                    error.message ||
                    "Payment failed."
                );

            }

        } finally {

            setLoading(false);

        }
    }


    /* =========================================
       PAGE
    ========================================= */

    return (

        <div>

            <Navbar />


            <main className="page">


                {/* =====================================
                    HEADER
                ===================================== */}

                <div className="page-header">

                    <p className="page-label">
                        PAYMENT
                    </p>

                    <h1>
                        Complete Payment
                    </h1>

                    <p>
                        Review your parking charges
                        and select a payment method.
                    </p>

                </div>


                <div className="payment-layout">


                    {/* =================================
                        BOOKING SUMMARY
                    ================================= */}

                    <div className="simple-card">

                        <h2>
                            Booking Summary
                        </h2>

                        <p className="card-description">
                            Review your parking reservation.
                        </p>


                        <div className="summary-list">


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
                                    Vehicle
                                </span>

                                <strong>
                                    {
                                        booking.vehicle_number ||
                                        "—"
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Vehicle Type
                                </span>

                                <strong>
                                    {
                                        booking.vehicle_type ||
                                        "—"
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Parking Slot
                                </span>

                                <strong>
                                    {
                                        booking.slot_number ||
                                        "—"
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Date
                                </span>

                                <strong>
                                    {
                                        booking.booking_date
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Start Time
                                </span>

                                <strong>
                                    {
                                        booking.start_time
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    End Time
                                </span>

                                <strong>
                                    {
                                        booking.end_time
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Rate
                                </span>

                                <strong>
                                    ₹20 / hour
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Parking Duration
                                </span>

                                <strong>

                                    {Math.ceil(
                                        (
                                            (
                                                Number(
                                                    booking.end_time
                                                        .split(":")[0]
                                                ) * 60
                                            ) +
                                            Number(
                                                booking.end_time
                                                    .split(":")[1]
                                            ) -
                                            (
                                                (
                                                    Number(
                                                        booking.start_time
                                                            .split(":")[0]
                                                    ) * 60
                                                ) +
                                                Number(
                                                    booking.start_time
                                                        .split(":")[1]
                                                )
                                            )
                                        ) / 60
                                    )}

                                    {" "}
                                    hour(s)

                                </strong>

                            </div>


                        </div>

                    </div>


                    {/* =================================
                        PAYMENT SECTION
                    ================================= */}

                    <div className="simple-card">

                        <h2>
                            Payment
                        </h2>

                        <p className="card-description">
                            Select your preferred payment method.
                        </p>


                        {/* AMOUNT */}

                        <div className="payment-amount">

                            <span>
                                Total Amount
                            </span>

                            <strong>
                                ₹{amount}
                            </strong>

                        </div>


                        {/* PAYMENT METHODS */}

                        <div className="payment-methods">


                            {/* UPI */}

                            <label
                                className={
                                    `payment-option ${
                                        paymentMethod === "UPI"
                                            ? "selected"
                                            : ""
                                    }`
                                }
                            >

                                <input
                                    type="radio"
                                    name="payment"
                                    value="UPI"
                                    checked={
                                        paymentMethod === "UPI"
                                    }
                                    onChange={(event) =>
                                        setPaymentMethod(
                                            event.target.value
                                        )
                                    }
                                />

                                <span>
                                    UPI
                                </span>

                            </label>


                            {/* CARD */}

                            <label
                                className={
                                    `payment-option ${
                                        paymentMethod === "CARD"
                                            ? "selected"
                                            : ""
                                    }`
                                }
                            >

                                <input
                                    type="radio"
                                    name="payment"
                                    value="CARD"
                                    checked={
                                        paymentMethod === "CARD"
                                    }
                                    onChange={(event) =>
                                        setPaymentMethod(
                                            event.target.value
                                        )
                                    }
                                />

                                <span>
                                    Card
                                </span>

                            </label>


                            {/* CASH */}

                            <label
                                className={
                                    `payment-option ${
                                        paymentMethod === "CASH"
                                            ? "selected"
                                            : ""
                                    }`
                                }
                            >

                                <input
                                    type="radio"
                                    name="payment"
                                    value="CASH"
                                    checked={
                                        paymentMethod === "CASH"
                                    }
                                    onChange={(event) =>
                                        setPaymentMethod(
                                            event.target.value
                                        )
                                    }
                                />

                                <span>
                                    Cash
                                </span>

                            </label>

                        </div>


                        {/* MESSAGE */}

                        {message && (

                            <div className="form-message">

                                {message}

                            </div>

                        )}


                        {/* PAY BUTTON */}

                        <button
                            type="button"
                            className="btn-primary payment-button"
                            onClick={
                                handlePayment
                            }
                            disabled={
                                loading
                            }
                        >

                            {loading
                                ? "Processing..."
                                : `Pay ₹${amount}`
                            }

                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
}


export default Payment;