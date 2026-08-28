import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";

import {
    getUserVehicles,
    getAvailableSlots,
    createBooking
} from "../services/api.js";


function Parking() {

    const navigate = useNavigate();

    /* =========================================
       USER
    ========================================= */

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const userId = user?.user_id;


    /* =========================================
       STATE
    ========================================= */

    const [vehicles, setVehicles] = useState([]);

    const [selectedVehicle, setSelectedVehicle] =
        useState("");

    const [bookingDate, setBookingDate] =
        useState("");

    const [startTime, setStartTime] =
        useState("");

    const [endTime, setEndTime] =
        useState("");

    const [slots, setSlots] =
        useState([]);

    const [selectedSlot, setSelectedSlot] =
        useState(null);

    const [message, setMessage] =
        useState("");

    const [loadingVehicles, setLoadingVehicles] =
        useState(true);

    const [loadingSlots, setLoadingSlots] =
        useState(false);

    const [bookingLoading, setBookingLoading] =
        useState(false);


    /* =========================================
       LOAD VEHICLES
    ========================================= */

    async function loadVehicles() {

        if (!userId) {

            setMessage("Please login first.");

            setLoadingVehicles(false);

            return;
        }

        try {

            setLoadingVehicles(true);

            setMessage("");

            const result =
                await getUserVehicles(userId);

            console.log(
                "USER VEHICLES:",
                result
            );

            if (Array.isArray(result)) {

                setVehicles(result);

            } else {

                setMessage(
                    result?.message ||
                    "Unable to load vehicles."
                );
            }

        } catch (error) {

            console.error(
                "VEHICLE ERROR:",
                error
            );

            setMessage(
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                "Unable to load vehicles."
            );

        } finally {

            setLoadingVehicles(false);

        }
    }


    useEffect(() => {

        loadVehicles();

    }, [userId]);


    /* =========================================
       SEARCH AVAILABLE SLOTS
    ========================================= */

    async function handleSearch(event) {

        event.preventDefault();

        setMessage("");

        setSlots([]);

        setSelectedSlot(null);


        if (!selectedVehicle) {

            setMessage(
                "Please select a vehicle."
            );

            return;
        }


        if (
            !bookingDate ||
            !startTime ||
            !endTime
        ) {

            setMessage(
                "Please select booking date and time."
            );

            return;
        }


        if (startTime >= endTime) {

            setMessage(
                "End time must be after start time."
            );

            return;
        }


        const vehicle = vehicles.find(
            (item) =>
                Number(item.vehicle_id) ===
                Number(selectedVehicle)
        );


        if (!vehicle) {

            setMessage(
                "Selected vehicle could not be found."
            );

            return;
        }


        try {

            setLoadingSlots(true);


            console.log(
                "SEARCH SLOTS:",
                {
                    vehicle_type:
                        vehicle.vehicle_type,

                    booking_date:
                        bookingDate,

                    start_time:
                        startTime,

                    end_time:
                        endTime
                }
            );


            const result =
                await getAvailableSlots(
                    vehicle.vehicle_type,
                    bookingDate,
                    startTime,
                    endTime
                );


            console.log(
                "AVAILABLE SLOTS:",
                result
            );


            if (Array.isArray(result)) {

                setSlots(result);

                if (result.length === 0) {

                    setMessage(
                        "No parking slots are available for the selected time."
                    );
                }

            } else {

                setMessage(
                    result?.error ||
                    result?.message ||
                    "Unable to find available slots."
                );
            }

        } catch (error) {

            console.error(
                "SLOT SEARCH ERROR:",
                error
            );

            setMessage(
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                "Unable to load available slots."
            );

        } finally {

            setLoadingSlots(false);

        }
    }


    /* =========================================
       SELECT SLOT
    ========================================= */

    function handleSelectSlot(slot) {

        setSelectedSlot(slot);

        setMessage("");

    }


    /* =========================================
       CONFIRM BOOKING
    ========================================= */

    async function handleBooking() {

        setMessage("");


        /* -----------------------------------------
           BASIC VALIDATION
        ----------------------------------------- */

        if (!userId) {

            setMessage(
                "Please login before booking."
            );

            return;
        }


        if (!selectedVehicle) {

            setMessage(
                "Please select a vehicle."
            );

            return;
        }


        if (!selectedSlot) {

            setMessage(
                "Please select a parking slot."
            );

            return;
        }


        if (
            !bookingDate ||
            !startTime ||
            !endTime
        ) {

            setMessage(
                "Please select booking date and time."
            );

            return;
        }


        if (startTime >= endTime) {

            setMessage(
                "End time must be after start time."
            );

            return;
        }


        /* -----------------------------------------
           BOOKING DATA
        ----------------------------------------- */

        const bookingData = {

            user_id:
                Number(userId),

            vehicle_id:
                Number(selectedVehicle),

            slot_id:
                Number(selectedSlot.slot_id),

            booking_date:
                bookingDate,

            start_time:
                startTime,

            end_time:
                endTime

        };


        console.log(
            "================================"
        );

        console.log(
            "BOOKING DATA:"
        );

        console.log(
            bookingData
        );

        console.log(
            "================================"
        );


        try {

            setBookingLoading(true);


            /* -----------------------------------------
               CREATE BOOKING
            ----------------------------------------- */

            const result =
                await createBooking(
                    bookingData
                );


            console.log(
                "BOOKING RESPONSE:",
                result
            );


            /* -----------------------------------------
               SUCCESS
            ----------------------------------------- */

            if (result?.booking_id) {

                setMessage(
                    "Booking created successfully."
                );


                const selectedVehicleDetails =
                    vehicles.find(
                        (vehicle) =>
                            Number(
                                vehicle.vehicle_id
                            ) ===
                            Number(selectedVehicle)
                    );


                const bookingForPayment = {

                    booking_id:
                        result.booking_id,

                    user_id:
                        Number(userId),

                    vehicle_id:
                        Number(selectedVehicle),

                    vehicle_number:
                        selectedVehicleDetails?.vehicle_number,

                    vehicle_type:
                        selectedVehicleDetails?.vehicle_type,

                    slot_id:
                        Number(selectedSlot.slot_id),

                    slot_number:
                        selectedSlot.slot_number,

                    booking_date:
                        bookingDate,

                    start_time:
                        startTime,

                    end_time:
                        endTime,

                    booking_status:
                        result.booking_status ||
                        "Booked"

                };


                /*
                    Go to payment page
                    after successful booking.
                */

                setTimeout(() => {

                    navigate(
                        "/payment",
                        {
                            state: {
                                booking:
                                    bookingForPayment
                            }
                        }
                    );

                }, 700);


                return;
            }


            /* -----------------------------------------
               BACKEND RETURNED AN ERROR
            ----------------------------------------- */

            setMessage(

                result?.error
                    ? `${result?.message || "Booking failed"}: ${result.error}`
                    : result?.message ||
                      "Booking could not be created."

            );


        } catch (error) {

            console.error(
                "================================"
            );

            console.error(
                "BOOKING REQUEST FAILED"
            );

            console.error(
                error
            );

            console.error(
                "RESPONSE:",
                error.response?.data
            );

            console.error(
                "================================"
            );


            /*
                IMPORTANT:
                Show BOTH Flask message
                and actual database error.
            */

            const response =
                error.response?.data;


            if (response?.error) {

                setMessage(
                    `${response.message || "Booking failed"}: ${response.error}`
                );

            } else if (response?.message) {

                setMessage(
                    response.message
                );

            } else if (error.message) {

                setMessage(
                    `Booking failed: ${error.message}`
                );

            } else {

                setMessage(
                    "Booking failed. Please check the Flask server."
                );
            }

        } finally {

            setBookingLoading(false);

        }
    }


    /* =========================================
       SELECTED VEHICLE
    ========================================= */

    const selectedVehicleDetails =
        vehicles.find(
            (vehicle) =>
                Number(vehicle.vehicle_id) ===
                Number(selectedVehicle)
        );


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
                        PARKING
                    </p>

                    <h1>
                        Book Parking
                    </h1>

                    <p>
                        Select your vehicle, parking time
                        and an available parking slot.
                    </p>

                </div>


                {/* =====================================
                    BOOKING FORM
                ===================================== */}

                <div className="booking-card">


                    <div className="booking-form-grid">


                        {/* VEHICLE */}

                        <div className="form-group">

                            <label>
                                Vehicle
                            </label>


                            {loadingVehicles ? (

                                <select disabled>

                                    <option>
                                        Loading vehicles...
                                    </option>

                                </select>

                            ) : vehicles.length === 0 ? (

                                <div>

                                    <select disabled>

                                        <option>
                                            No vehicles registered
                                        </option>

                                    </select>


                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        style={{
                                            marginTop: "10px"
                                        }}
                                        onClick={() =>
                                            navigate("/vehicles")
                                        }
                                    >
                                        Add a Vehicle
                                    </button>

                                </div>

                            ) : (

                                <select
                                    value={selectedVehicle}
                                    onChange={(event) => {

                                        setSelectedVehicle(
                                            event.target.value
                                        );

                                        setSlots([]);

                                        setSelectedSlot(null);

                                        setMessage("");

                                    }}
                                >

                                    <option value="">
                                        Select a vehicle
                                    </option>


                                    {vehicles.map(
                                        (vehicle) => (

                                            <option
                                                key={
                                                    vehicle.vehicle_id
                                                }
                                                value={
                                                    vehicle.vehicle_id
                                                }
                                            >

                                                {
                                                    vehicle.vehicle_number
                                                }

                                                {" — "}

                                                {
                                                    vehicle.vehicle_type
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            )}

                        </div>


                        {/* DATE */}

                        <div className="form-group">

                            <label>
                                Booking Date
                            </label>

                            <input
                                type="date"
                                value={bookingDate}
                                onChange={(event) => {

                                    setBookingDate(
                                        event.target.value
                                    );

                                    setSlots([]);

                                    setSelectedSlot(null);

                                    setMessage("");

                                }}
                            />

                        </div>


                        {/* START TIME */}

                        <div className="form-group">

                            <label>
                                Start Time
                            </label>

                            <input
                                type="time"
                                value={startTime}
                                onChange={(event) => {

                                    setStartTime(
                                        event.target.value
                                    );

                                    setSlots([]);

                                    setSelectedSlot(null);

                                    setMessage("");

                                }}
                            />

                        </div>


                        {/* END TIME */}

                        <div className="form-group">

                            <label>
                                End Time
                            </label>

                            <input
                                type="time"
                                value={endTime}
                                onChange={(event) => {

                                    setEndTime(
                                        event.target.value
                                    );

                                    setSlots([]);

                                    setSelectedSlot(null);

                                    setMessage("");

                                }}
                            />

                        </div>

                    </div>


                    {/* SELECTED VEHICLE */}

                    {selectedVehicleDetails && (

                        <div
                            style={{
                                marginTop: "15px",
                                padding: "12px",
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                borderRadius: "5px"
                            }}
                        >

                            <strong>
                                {
                                    selectedVehicleDetails.vehicle_number
                                }
                            </strong>

                            <span
                                style={{
                                    marginLeft: "10px",
                                    color: "#64748b",
                                    fontSize: "12px"
                                }}
                            >
                                {
                                    selectedVehicleDetails.vehicle_type
                                }
                            </span>

                        </div>

                    )}


                    {/* MESSAGE */}

                    {message && (

                        <div className="form-message">

                            {message}

                        </div>

                    )}


                    {/* FIND SLOTS */}

                    <button
                        type="button"
                        className="btn-primary"
                        onClick={handleSearch}
                        disabled={
                            loadingSlots ||
                            loadingVehicles ||
                            vehicles.length === 0
                        }
                    >

                        {loadingSlots
                            ? "Searching..."
                            : "Find Available Slots"
                        }

                    </button>

                </div>


                {/* =====================================
                    AVAILABLE SLOTS
                ===================================== */}

                {slots.length > 0 && (

                    <section className="slots-section">

                        <div className="section-header">

                            <h2>
                                Available Parking Slots
                            </h2>

                            <p>
                                Select one slot for your booking.
                            </p>

                        </div>


                        <div className="slots-grid">

                            {slots.map((slot) => (

                                <button
                                    type="button"
                                    key={slot.slot_id}
                                    className={
                                        `slot ${
                                            selectedSlot?.slot_id ===
                                            slot.slot_id
                                                ? "selected"
                                                : ""
                                        }`
                                    }
                                    onClick={() =>
                                        handleSelectSlot(slot)
                                    }
                                >

                                    <strong>
                                        {slot.slot_number}
                                    </strong>

                                    <span>
                                        {slot.vehicle_type}
                                    </span>

                                </button>

                            ))}

                        </div>


                        {/* =================================
                            CONFIRM
                        ================================= */}

                        {selectedSlot && (

                            <div className="booking-confirm">

                                <p>

                                    Selected slot:{" "}

                                    <strong>
                                        {
                                            selectedSlot.slot_number
                                        }
                                    </strong>

                                </p>


                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={
                                        handleBooking
                                    }
                                    disabled={
                                        bookingLoading
                                    }
                                >

                                    {bookingLoading
                                        ? "Creating Booking..."
                                        : "Confirm Booking"
                                    }

                                </button>

                            </div>

                        )}

                    </section>

                )}

            </main>

        </div>
    );
}


export default Parking;