from datetime import date, datetime, timedelta

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

from database import get_db_connection


def json_ready(value):
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, timedelta):
        return str(value)
    return value


app = Flask(__name__)

CORS(app)


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():
    return "Smart Parking Backend is Running!"


# =========================================================
# TEST API
# =========================================================

@app.route("/api/test")
def test():
    return jsonify({
        "message": "Backend connected successfully!",
        "project": "Smart Parking Management System"
    })


# =========================================================
# PARKING SLOTS - ALL
# =========================================================

@app.route("/api/parking-slots", methods=["GET"])
def get_parking_slots():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            slot_id,
            slot_number,
            vehicle_type,
            status
        FROM parking_slots
        ORDER BY slot_id
    """)

    slots = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(slots), 200


# =========================================================
# USER REGISTRATION
# =========================================================

@app.route("/api/register", methods=["POST"])
def register():

    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    # Validate required fields
    if not name or not email or not password:
        return jsonify({
            "message": "Name, email and password are required"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Check whether email already exists
    cursor.execute(
        """
        SELECT user_id
        FROM users
        WHERE email = %s
        """,
        (email,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        cursor.close()
        connection.close()

        return jsonify({
            "message": "Email already registered"
        }), 409

    # Hash password before storing it
    hashed_password = generate_password_hash(password)

    # Insert new user
    cursor.execute(
        """
        INSERT INTO users
        (name, email, password, role)
        VALUES (%s, %s, %s, 'USER')
        """,
        (name, email, hashed_password)
    )

    connection.commit()

    new_user_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return jsonify({
        "message": "Registration successful",
        "user_id": new_user_id
    }), 201


# =========================================================
# USER LOGIN
# =========================================================

@app.route("/api/login", methods=["POST"])
def login():

    data = request.json

    email = data.get("email")
    password = data.get("password")

    # Validate required fields
    if not email or not password:
        return jsonify({
            "message": "Email and password are required"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Find user by email
    cursor.execute(
        """
        SELECT
            user_id,
            name,
            email,
            password,
            role
        FROM users
        WHERE email = %s
        """,
        (email,)
    )

    user = cursor.fetchone()

    cursor.close()
    connection.close()

    # User not found
    if not user:
        return jsonify({
            "message": "Invalid email or password"
        }), 401

    # Check password
    password_correct = check_password_hash(
        user["password"],
        password
    )

    if not password_correct:
        return jsonify({
            "message": "Invalid email or password"
        }), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "user_id": user["user_id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }), 200


# =========================================================
# VEHICLES - GET USER VEHICLES
# =========================================================

@app.route("/api/vehicles/<int:user_id>", methods=["GET"])
def get_user_vehicles(user_id):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            vehicle_id,
            user_id,
            vehicle_number,
            vehicle_type
        FROM vehicles
        WHERE user_id = %s
        ORDER BY vehicle_id
        """,
        (user_id,)
    )

    vehicles = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(vehicles), 200


# =========================================================
# VEHICLES - ADD
# =========================================================

@app.route("/api/vehicles", methods=["POST"])
def add_vehicle():

    data = request.json

    user_id = data.get("user_id")
    vehicle_number = data.get("vehicle_number")
    vehicle_type = data.get("vehicle_type")

    # Validate required fields
    if not user_id or not vehicle_number or not vehicle_type:
        return jsonify({
            "message": "user_id, vehicle_number and vehicle_type are required"
        }), 400

    # Allowed vehicle categories
    allowed_types = [
        "TWO_WHEELER",
        "FOUR_WHEELER",
        "HEAVY_VEHICLE"
    ]

    if vehicle_type not in allowed_types:
        return jsonify({
            "message": "Invalid vehicle type"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Check whether user exists
    cursor.execute(
        """
        SELECT user_id
        FROM users
        WHERE user_id = %s
        """,
        (user_id,)
    )

    user = cursor.fetchone()

    if not user:
        cursor.close()
        connection.close()

        return jsonify({
            "message": "User does not exist"
        }), 404

    # Check duplicate vehicle number
    cursor.execute(
        """
        SELECT vehicle_id
        FROM vehicles
        WHERE vehicle_number = %s
        """,
        (vehicle_number,)
    )

    existing_vehicle = cursor.fetchone()

    if existing_vehicle:
        cursor.close()
        connection.close()

        return jsonify({
            "message": "Vehicle number already registered"
        }), 409

    # Insert vehicle
    cursor.execute(
        """
        INSERT INTO vehicles
        (user_id, vehicle_number, vehicle_type)
        VALUES (%s, %s, %s)
        """,
        (user_id, vehicle_number, vehicle_type)
    )

    connection.commit()

    new_vehicle_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return jsonify({
        "message": "Vehicle added successfully",
        "vehicle_id": new_vehicle_id
    }), 201


# =========================================================
# VEHICLES - DELETE
# =========================================================

@app.route("/api/vehicles/<int:vehicle_id>", methods=["DELETE"])
def delete_vehicle(vehicle_id):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Check whether vehicle exists
    cursor.execute(
        """
        SELECT vehicle_id
        FROM vehicles
        WHERE vehicle_id = %s
        """,
        (vehicle_id,)
    )

    vehicle = cursor.fetchone()

    if not vehicle:
        cursor.close()
        connection.close()

        return jsonify({
            "message": "Vehicle not found"
        }), 404

    # Delete vehicle
    cursor.execute(
        """
        DELETE FROM vehicles
        WHERE vehicle_id = %s
        """,
        (vehicle_id,)
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "message": "Vehicle deleted successfully"
    }), 200


# =========================================================
# PARKING SLOTS - AVAILABLE FOR DATE/TIME
# =========================================================

@app.route("/api/parking-slots/available", methods=["GET"])
def get_available_slots():

    vehicle_type = request.args.get("vehicle_type")
    booking_date = request.args.get("booking_date")
    start_time = request.args.get("start_time")
    end_time = request.args.get("end_time")

    allowed_types = [
        "TWO_WHEELER",
        "FOUR_WHEELER",
        "HEAVY_VEHICLE"
    ]

    # Validate vehicle type
    if vehicle_type not in allowed_types:
        return jsonify({
            "message": "Valid vehicle_type is required"
        }), 400

    # Validate date and time
    if not booking_date or not start_time or not end_time:
        return jsonify({
            "message": "booking_date, start_time and end_time are required"
        }), 400

    # Validate time range
    if start_time >= end_time:
        return jsonify({
            "message": "End time must be after start time"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Find compatible slots that do not have
    # a conflicting active booking
    cursor.execute(
        """
        SELECT
            ps.slot_id,
            ps.slot_number,
            ps.vehicle_type,
            ps.status
        FROM parking_slots ps
        WHERE ps.vehicle_type = %s
        AND ps.status = 'AVAILABLE'
        AND ps.slot_id NOT IN (
            SELECT b.slot_id
            FROM bookings b
            WHERE b.booking_date = %s
            AND b.booking_status = 'CONFIRMED'
            AND b.start_time < %s
            AND b.end_time > %s
        )
        ORDER BY ps.slot_id
        """,
        (
            vehicle_type,
            booking_date,
            end_time,
            start_time
        )
    )

    slots = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(slots), 200


# =========================================================
# BOOKINGS - CREATE
# =========================================================

@app.route("/api/bookings", methods=["POST"])
def create_booking():

    data = request.json

    user_id = data.get("user_id")
    vehicle_id = data.get("vehicle_id")
    slot_id = data.get("slot_id")
    booking_date = data.get("booking_date")
    start_time = data.get("start_time")
    end_time = data.get("end_time")

    # -----------------------------------------------------
    # 1. Validate required fields
    # -----------------------------------------------------

    if not user_id or not vehicle_id or not slot_id:
        return jsonify({
            "message": "user_id, vehicle_id and slot_id are required"
        }), 400

    if not booking_date or not start_time or not end_time:
        return jsonify({
            "message": "booking_date, start_time and end_time are required"
        }), 400

    # -----------------------------------------------------
    # 2. Validate time
    # -----------------------------------------------------

    if start_time >= end_time:
        return jsonify({
            "message": "End time must be after start time"
        }), 400

    connection = None
    cursor = None

    try:

        # -------------------------------------------------
        # 3. Start database transaction
        # -------------------------------------------------

        connection = get_db_connection()

        connection.start_transaction()

        cursor = connection.cursor(dictionary=True)

        # -------------------------------------------------
        # 4. Check whether user exists
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT user_id
            FROM users
            WHERE user_id = %s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if not user:
            return jsonify({
                "message": "User does not exist"
            }), 404

        # -------------------------------------------------
        # 5. Check vehicle and ownership
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                vehicle_id,
                user_id,
                vehicle_type
            FROM vehicles
            WHERE vehicle_id = %s
            """,
            (vehicle_id,)
        )

        vehicle = cursor.fetchone()

        if not vehicle:
            return jsonify({
                "message": "Vehicle does not exist"
            }), 404

        if vehicle["user_id"] != user_id:
            return jsonify({
                "message": "Vehicle does not belong to this user"
            }), 403

        # -------------------------------------------------
        # 6. LOCK and check parking slot
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                slot_id,
                slot_number,
                vehicle_type,
                status
            FROM parking_slots
            WHERE slot_id = %s
            FOR UPDATE
            """,
            (slot_id,)
        )

        slot = cursor.fetchone()

        if not slot:
            return jsonify({
                "message": "Parking slot does not exist"
            }), 404

        # -------------------------------------------------
        # 7. Check vehicle-slot compatibility
        # -------------------------------------------------

        if vehicle["vehicle_type"] != slot["vehicle_type"]:

            return jsonify({
                "message": "Vehicle type is not compatible with this parking slot"
            }), 400

        # -------------------------------------------------
        # 8. Check current slot status
        # -------------------------------------------------

        if slot["status"] != "AVAILABLE":

            return jsonify({
                "message": "Parking slot is not currently available"
            }), 409

        # -------------------------------------------------
        # 9. Check for overlapping bookings
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT booking_id
            FROM bookings
            WHERE slot_id = %s
            AND booking_date = %s
            AND booking_status = 'CONFIRMED'
            AND start_time < %s
            AND end_time > %s
            """,
            (
                slot_id,
                booking_date,
                end_time,
                start_time
            )
        )

        conflicting_booking = cursor.fetchone()

        if conflicting_booking:

            return jsonify({
                "message": "Parking slot is already booked for this time"
            }), 409

        # -------------------------------------------------
        # 10. Create booking
        # -------------------------------------------------

        cursor.execute(
            """
            INSERT INTO bookings
            (
                user_id,
                vehicle_id,
                slot_id,
                booking_date,
                start_time,
                end_time,
                booking_status
            )
            VALUES
            (%s, %s, %s, %s, %s, %s, 'CONFIRMED')
            """,
            (
                user_id,
                vehicle_id,
                slot_id,
                booking_date,
                start_time,
                end_time
            )
        )

        # -------------------------------------------------
        # 11. Get newly created booking ID
        # -------------------------------------------------

        new_booking_id = cursor.lastrowid

        # -------------------------------------------------
        # 12. Commit transaction
        # -------------------------------------------------

        connection.commit()

        return jsonify({
            "message": "Booking created successfully",
            "booking_id": new_booking_id,
            "slot_id": slot_id,
            "booking_date": booking_date,
            "start_time": start_time,
            "end_time": end_time,
            "booking_status": "CONFIRMED"
        }), 201

    except Exception as e:

        # -------------------------------------------------
        # Roll back if anything goes wrong
        # -------------------------------------------------

        if connection:
            connection.rollback()

        return jsonify({
            "message": "Booking failed",
            "error": str(e)
        }), 500

    finally:

        # -------------------------------------------------
        # Always close database resources
        # -------------------------------------------------

        if cursor:
            cursor.close()

        if connection:
            connection.close()

    # =========================================================
# BOOKINGS - GET USER BOOKINGS
# =========================================================

@app.route("/api/bookings/<int:user_id>", methods=["GET"])
def get_user_bookings(user_id):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        # -------------------------------------------------
        # 1. Check whether user exists
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT user_id
            FROM users
            WHERE user_id = %s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if not user:
            return jsonify({
                "message": "User does not exist"
            }), 404

        # -------------------------------------------------
        # 2. Get user's bookings
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                b.booking_id,
                b.booking_date,
                b.start_time,
                b.end_time,
                b.booking_status,

                v.vehicle_id,
                v.vehicle_number,
                v.vehicle_type,

                ps.slot_id,
                ps.slot_number

            FROM bookings b

            JOIN vehicles v
                ON b.vehicle_id = v.vehicle_id

            JOIN parking_slots ps
                ON b.slot_id = ps.slot_id

            WHERE b.user_id = %s

            ORDER BY
                b.booking_date DESC,
                b.start_time DESC
            """,
            (user_id,)
        )

        bookings = cursor.fetchall()

        bookings = [
            {
                key: json_ready(value)
                for key, value in booking.items()
            }
            for booking in bookings
        ]

        return jsonify(bookings), 200

    finally:

        cursor.close()
        connection.close()

    # =========================================================
# BOOKINGS - CANCEL
# =========================================================

@app.route("/api/bookings/<int:booking_id>/cancel", methods=["PUT"])
def cancel_booking(booking_id):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT
                booking_id,
                booking_status
            FROM bookings
            WHERE booking_id = %s
            """,
            (booking_id,)
        )

        booking = cursor.fetchone()

        if not booking:
            return jsonify({
                "message": "Booking not found"
            }), 404

        if booking["booking_status"] == "CANCELLED":
            return jsonify({
                "message": "Booking is already cancelled"
            }), 409

        cursor.execute(
            """
            UPDATE bookings
            SET booking_status = 'CANCELLED'
            WHERE booking_id = %s
            """,
            (booking_id,)
        )

        connection.commit()

        return jsonify({
            "message": "Booking cancelled successfully",
            "booking_id": booking_id
        }), 200

    except Exception as e:

        connection.rollback()

        return jsonify({
            "message": "Failed to cancel booking",
            "error": str(e)
        }), 500

    finally:

        cursor.close()
        connection.close()

    # =========================================================
# PAYMENTS - CREATE
# =========================================================
# =========================================================
# PAYMENTS - CREATE
# =========================================================

# =========================================================
# PAYMENTS - CREATE
# =========================================================

@app.route("/api/payments", methods=["POST"])
def create_payment():

    connection = None
    cursor = None

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "message": "No payment data received"
            }), 400

        booking_id = data.get("booking_id")
        amount = data.get("amount")
        payment_method = data.get("payment_method")

        # -------------------------------------------------
        # VALIDATE INPUT
        # -------------------------------------------------

        if not booking_id:
            return jsonify({
                "message": "booking_id is required"
            }), 400

        if amount is None:
            return jsonify({
                "message": "amount is required"
            }), 400

        if not payment_method:
            return jsonify({
                "message": "payment_method is required"
            }), 400

        # -------------------------------------------------
        # NORMALIZE PAYMENT METHOD
        # -------------------------------------------------

        payment_method = str(payment_method).upper().strip()

        allowed_methods = [
            "UPI",
            "CARD",
            "CASH"
        ]

        if payment_method not in allowed_methods:
            return jsonify({
                "message": "Invalid payment method. Use UPI, CARD or CASH."
            }), 400

        # -------------------------------------------------
        # VALIDATE AMOUNT
        # -------------------------------------------------

        try:
            amount = float(amount)
        except (ValueError, TypeError):

            return jsonify({
                "message": "Invalid payment amount"
            }), 400

        if amount <= 0:
            return jsonify({
                "message": "Payment amount must be greater than zero"
            }), 400

        # -------------------------------------------------
        # DATABASE CONNECTION
        # -------------------------------------------------

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        # -------------------------------------------------
        # CHECK BOOKING
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                booking_id,
                booking_status
            FROM bookings
            WHERE booking_id = %s
            """,
            (booking_id,)
        )

        booking = cursor.fetchone()

        if not booking:

            return jsonify({
                "message": "Booking not found"
            }), 404

        # -------------------------------------------------
        # CHECK BOOKING STATUS
        # -------------------------------------------------

        booking_status = str(
            booking["booking_status"]
        ).upper().strip()

        if booking_status == "CANCELLED":

            return jsonify({
                "message": "Cannot make payment for a cancelled booking"
            }), 400

        # -------------------------------------------------
        # CHECK EXISTING PAYMENT
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                payment_id,
                payment_status
            FROM payments
            WHERE booking_id = %s
            """,
            (booking_id,)
        )

        existing_payment = cursor.fetchone()

        if existing_payment:

            return jsonify({
                "message": "Payment already exists for this booking",
                "payment_id": existing_payment["payment_id"],
                "payment_status": existing_payment["payment_status"]
            }), 409

        # -------------------------------------------------
        # CREATE PAYMENT
        #
        # IMPORTANT:
        # Your database accepts:
        # PENDING / SUCCESS / FAILED
        #
        # We use SUCCESS because this is a
        # simulated payment system.
        # -------------------------------------------------

        cursor.execute(
            """
            INSERT INTO payments
            (
                booking_id,
                amount,
                payment_method,
                payment_status
            )
            VALUES
            (
                %s,
                %s,
                %s,
                'SUCCESS'
            )
            """,
            (
                booking_id,
                amount,
                payment_method
            )
        )

        # -------------------------------------------------
        # GET PAYMENT ID
        # -------------------------------------------------

        payment_id = cursor.lastrowid

        # -------------------------------------------------
        # COMMIT
        # -------------------------------------------------

        connection.commit()

        # -------------------------------------------------
        # RETURN SUCCESS
        # -------------------------------------------------

        return jsonify({

            "message": "Payment successful",

            "payment_id": payment_id,

            "booking_id": booking_id,

            "amount": amount,

            "payment_method": payment_method,

            "payment_status": "SUCCESS"

        }), 201

    # -----------------------------------------------------
    # ERROR HANDLING
    # -----------------------------------------------------

    except Exception as e:

        if connection:
            connection.rollback()

        print("=================================")
        print("PAYMENT ERROR:")
        print(str(e))
        print("=================================")

        return jsonify({

            "message": "Payment failed",

            "error": str(e)

        }), 500

    # -----------------------------------------------------
    # CLOSE DATABASE
    # -----------------------------------------------------

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# PAYMENTS - GET PAYMENT
# =========================================================

@app.route("/api/payments/<int:booking_id>", methods=["GET"])
def get_payment(booking_id):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT
                payment_id,
                booking_id,
                amount,
                payment_method,
                payment_status,
                payment_date
            FROM payments
            WHERE booking_id = %s
            """,
            (booking_id,)
        )

        payment = cursor.fetchone()

        if not payment:
            return jsonify({
                "message": "Payment not found"
            }), 404

        payment = {
            key: json_ready(value)
            for key, value in payment.items()
        }

        return jsonify(payment), 200

    finally:

        cursor.close()
        connection.close()


    # =========================================================
# ADMIN - GET USERS
# =========================================================

@app.route("/api/admin/users", methods=["GET"])
def admin_get_users():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT
                user_id,
                name,
                email,
                role
            FROM users
            ORDER BY user_id
            """
        )

        users = cursor.fetchall()

        return jsonify(users), 200

    finally:

        cursor.close()
        connection.close()

    # =========================================================
# ADMIN - GET BOOKINGS
# =========================================================

@app.route("/api/admin/bookings", methods=["GET"])
def admin_get_bookings():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT
                b.booking_id,
                u.name AS user_name,
                u.email,
                v.vehicle_number,
                v.vehicle_type,
                ps.slot_number,
                b.booking_date,
                b.start_time,
                b.end_time,
                b.booking_status

            FROM bookings b

            JOIN users u
                ON b.user_id = u.user_id

            JOIN vehicles v
                ON b.vehicle_id = v.vehicle_id

            JOIN parking_slots ps
                ON b.slot_id = ps.slot_id

            ORDER BY b.booking_date DESC, b.start_time DESC
            """
        )

        bookings = cursor.fetchall()

        return jsonify(bookings), 200

    finally:

        cursor.close()
        connection.close()


    # =========================================================
# ADMIN - GET PAYMENTS
# =========================================================

@app.route("/api/admin/payments", methods=["GET"])
def admin_get_payments():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT
                p.payment_id,
                p.booking_id,
                u.name AS user_name,
                u.email,
                p.amount,
                p.payment_method,
                p.payment_status,
                p.payment_date

            FROM payments p

            JOIN bookings b
                ON p.booking_id = b.booking_id

            JOIN users u
                ON b.user_id = u.user_id

            ORDER BY p.payment_date DESC
            """
        )

        payments = cursor.fetchall()

        return jsonify(payments), 200

    finally:

        cursor.close()
        connection.close()


    # =========================================================
# ADMIN - DASHBOARD STATISTICS
# =========================================================

@app.route("/api/admin/stats", methods=["GET"])
def admin_stats():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute("SELECT COUNT(*) AS total_users FROM users")
        total_users = cursor.fetchone()["total_users"]

        cursor.execute("SELECT COUNT(*) AS total_vehicles FROM vehicles")
        total_vehicles = cursor.fetchone()["total_vehicles"]

        cursor.execute("SELECT COUNT(*) AS total_slots FROM parking_slots")
        total_slots = cursor.fetchone()["total_slots"]

        cursor.execute(
            """
            SELECT COUNT(*) AS available_slots
            FROM parking_slots
            WHERE status = 'AVAILABLE'
            """
        )
        available_slots = cursor.fetchone()["available_slots"]

        cursor.execute(
            """
            SELECT COUNT(*) AS total_bookings
            FROM bookings
            """
        )
        total_bookings = cursor.fetchone()["total_bookings"]

        cursor.execute(
            """
            SELECT COUNT(*) AS active_bookings
            FROM bookings
            WHERE booking_status = 'CONFIRMED'
            """
        )
        active_bookings = cursor.fetchone()["active_bookings"]

        cursor.execute(
            """
            SELECT
                COALESCE(SUM(amount), 0) AS total_revenue
            FROM payments
            WHERE payment_status = 'Paid'
            """
        )
        total_revenue = cursor.fetchone()["total_revenue"]

        return jsonify({
            "total_users": total_users,
            "total_vehicles": total_vehicles,
            "total_slots": total_slots,
            "available_slots": available_slots,
            "total_bookings": total_bookings,
            "active_bookings": active_bookings,
            "total_revenue": total_revenue
        }), 200

    finally:

        cursor.close()
        connection.close()

# =========================================================
# START FLASK SERVER
# =========================================================

if __name__ == "__main__":
    app.run(debug=True)