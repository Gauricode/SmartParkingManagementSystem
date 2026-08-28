# Smart Parking Management System

A full-stack smart parking application that lets users register, manage vehicles, view available parking slots, create bookings, make payments, and review booking history.

## Tech Stack

- Frontend: React + Vite + JavaScript
- Backend: Python Flask
- Database: MySQL
- API Communication: Flask-CORS + Axios

## Project Structure

```text
SmartParkingManagementSystem/
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── requirements.txt
│   └── ...
├── database/
│   ├── bookings.sql
│   ├── db.sql
│   ├── parking_slots.sql
│   ├── payments.sql
│   ├── users.sql
│   └── vehicles.sql
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
└── README.md
```

## Features

- User registration and login
- Vehicle registration and management
- Parking slot availability checks by vehicle type and time range
- Booking creation with conflict detection
- Booking cancellation
- Payment processing for bookings
- Admin dashboard for users, bookings, and payments

## Prerequisites

Before running the project, make sure you have:

- Python 3.10+
- Node.js and npm
- MySQL server running locally
- Git

## Backend Setup

1. Open a terminal in the backend folder:

```bash
cd SmartParkingManagementSystem/backend
```

2. Create and activate a virtual environment:

```bash
python -m venv .venv
.venv\Scripts\activate
```

3. Install the Python packages:

```bash
pip install -r requirements.txt
```

4. Make sure your MySQL database is running and update the connection settings in `database.py` if needed.

5. Start the Flask server:

```bash
python app.py
```

The backend will run at:

```text
http://127.0.0.1:5000
```

## Frontend Setup

1. Open a terminal in the frontend folder:

```bash
cd SmartParkingManagementSystem/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend:

```bash
npm run dev -- --host 0.0.0.0
```

The Vite app will run at:

```text
http://localhost:5173
```

## Database Setup

Import the SQL files from the `database/` folder into MySQL in the correct order:

1. `users.sql`
2. `vehicles.sql`
3. `parking_slots.sql`
4. `bookings.sql`
5. `payments.sql`

You can also import `db.sql` if it contains the full schema setup for the project.

## Main API Endpoints

### Auth

- `POST /api/register`
- `POST /api/login`

### Vehicles

- `GET /api/vehicles/<user_id>`
- `POST /api/vehicles`
- `DELETE /api/vehicles/<vehicle_id>`

### Parking

- `GET /api/parking-slots`
- `GET /api/parking-slots/available`

### Bookings

- `POST /api/bookings`
- `GET /api/bookings/<user_id>`
- `PUT /api/bookings/<booking_id>/cancel`

### Payments

- `POST /api/payments`
- `GET /api/payments/<booking_id>`

### Admin

- `GET /api/admin/users`
- `GET /api/admin/bookings`
- `GET /api/admin/payments`
- `GET /api/admin/stats`

## Notes

- The frontend sends the logged-in user ID and selected vehicle ID to the backend for booking creation.
- The backend validates vehicle ownership, slot availability, and time conflicts before creating a booking.
- The payment amount is calculated on the frontend and sent to the payment API with the booking ID and payment method.

## Common Run Order

1. Start MySQL
2. Start backend Flask app
3. Start frontend Vite app
4. Login to the app and begin booking

## License

This project is for educational and personal project use.
