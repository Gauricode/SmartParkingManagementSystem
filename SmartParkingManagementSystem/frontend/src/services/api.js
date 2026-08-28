import axios from "axios";


/* =========================================
   AXIOS CONFIGURATION
========================================= */

const api = axios.create({
    baseURL: "http://127.0.0.1:5000/api",

    headers: {
        "Content-Type": "application/json"
    }
});


/* =========================================
   AUTHENTICATION
========================================= */


/*
    POST /api/register
*/

export const registerUser = async (data) => {

    const response = await api.post(
        "/register",
        data
    );

    return response.data;
};


/*
    POST /api/login
*/

export const loginUser = async (data) => {

    const response = await api.post(
        "/login",
        data
    );

    return response.data;
};


/* =========================================
   PARKING SLOTS
========================================= */


/*
    GET /api/parking-slots

    Returns all parking slots.
*/

export const getParkingSlots = async () => {

    const response = await api.get(
        "/parking-slots"
    );

    return response.data;
};


/*
    GET /api/parking-slots/available

    Parameters:
        vehicle_type
        booking_date
        start_time
        end_time
*/

export const getAvailableSlots = async (
    vehicleType,
    bookingDate,
    startTime,
    endTime
) => {

    const response = await api.get(
        "/parking-slots/available",
        {
            params: {
                vehicle_type: vehicleType,
                booking_date: bookingDate,
                start_time: startTime,
                end_time: endTime
            }
        }
    );

    return response.data;
};


/* =========================================
   VEHICLES
========================================= */


/*
    GET /api/vehicles/<user_id>

    IMPORTANT:
    Backend route is:

    /api/vehicles/<int:user_id>

    NOT:

    /api/vehicles/user/<user_id>
*/

export const getUserVehicles = async (
    userId
) => {

    const response = await api.get(
        `/vehicles/${userId}`
    );

    return response.data;
};


/*
    POST /api/vehicles
*/

export const addVehicle = async (
    data
) => {

    const response = await api.post(
        "/vehicles",
        data
    );

    return response.data;
};


/*
    DELETE /api/vehicles/<vehicle_id>
*/

export const deleteVehicle = async (
    vehicleId
) => {

    const response = await api.delete(
        `/vehicles/${vehicleId}`
    );

    return response.data;
};


/* =========================================
   BOOKINGS
========================================= */


/*
    POST /api/bookings
*/

export const createBooking = async (
    data
) => {

    const response = await api.post(
        "/bookings",
        data
    );

    return response.data;
};


/*
    GET /api/bookings/<user_id>

    IMPORTANT:
    Backend route is:

    /api/bookings/<int:user_id>

    NOT:

    /api/bookings/user/<user_id>
*/

export const getUserBookings = async (
    userId
) => {

    const response = await api.get(
        `/bookings/${userId}`
    );

    return response.data;
};


/*
    PUT /api/bookings/<booking_id>/cancel
*/

export const cancelBooking = async (
    bookingId
) => {

    const response = await api.put(
        `/bookings/${bookingId}/cancel`
    );

    return response.data;
};


/* =========================================
   PAYMENTS
========================================= */


/*
    POST /api/payments
*/

export const createPayment = async (
    data
) => {

    const response = await api.post(
        "/payments",
        data
    );

    return response.data;
};


/*
    GET /api/payments/<booking_id>

    IMPORTANT:
    Backend route is:

    /api/payments/<int:booking_id>

    NOT:

    /api/payments/booking/<booking_id>
*/

export const getBookingPayment = async (
    bookingId
) => {

    const response = await api.get(
        `/payments/${bookingId}`
    );

    return response.data;
};


/* =========================================
   ADMIN
========================================= */


/*
    GET /api/admin/stats
*/

export const getAdminStats = async () => {

    const response = await api.get(
        "/admin/stats"
    );

    return response.data;
};


/*
    GET /api/admin/users
*/

export const getAdminUsers = async () => {

    const response = await api.get(
        "/admin/users"
    );

    return response.data;
};


/*
    GET /api/admin/bookings
*/

export const getAdminBookings = async () => {

    const response = await api.get(
        "/admin/bookings"
    );

    return response.data;
};


/*
    GET /api/admin/payments
*/

export const getAdminPayments = async () => {

    const response = await api.get(
        "/admin/payments"
    );

    return response.data;
};


/*
    ADMIN SLOTS

    Your backend does NOT currently have:

    /api/admin/slots

    But it already has:

    GET /api/parking-slots

    So we use that existing endpoint.
*/

export const getAdminSlots = async () => {

    const response = await api.get(
        "/parking-slots"
    );

    return response.data;
};


/* =========================================
   BACKEND TEST
========================================= */


/*
    GET /api/test
*/

export const testBackend = async () => {

    const response = await api.get(
        "/test"
    );

    return response.data;
};


/* =========================================
   DEFAULT EXPORT
========================================= */

export default api;