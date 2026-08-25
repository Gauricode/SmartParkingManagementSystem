CREATE DATABASE IF NOT EXISTS smart_parking;
USE smart_parking;

-- =========================================
-- 1. USERS
-- =========================================

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER'
);


-- =========================================
-- 2. VEHICLES
-- =========================================

CREATE TABLE vehicles (
    vehicle_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    vehicle_number VARCHAR(20) NOT NULL UNIQUE,
    vehicle_type ENUM(
        'TWO_WHEELER',
        'FOUR_WHEELER',
        'HEAVY_VEHICLE'
    ) NOT NULL,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


-- =========================================
-- 3. PARKING SLOTS
-- =========================================

CREATE TABLE parking_slots (
    slot_id INT PRIMARY KEY AUTO_INCREMENT,
    slot_number VARCHAR(10) NOT NULL UNIQUE,

    vehicle_type ENUM(
        'TWO_WHEELER',
        'FOUR_WHEELER',
        'HEAVY_VEHICLE'
    ) NOT NULL,

    status ENUM(
        'AVAILABLE',
        'RESERVED',
        'OCCUPIED'
    ) NOT NULL DEFAULT 'AVAILABLE'
);


-- =========================================
-- 4. BOOKINGS
-- =========================================

CREATE TABLE bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    slot_id INT NOT NULL,

    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    booking_status ENUM(
        'CONFIRMED',
        'CANCELLED',
        'COMPLETED'
    ) NOT NULL DEFAULT 'CONFIRMED',

    FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(vehicle_id),

    FOREIGN KEY (slot_id)
        REFERENCES parking_slots(slot_id),

    CONSTRAINT chk_booking_time
        CHECK (end_time > start_time)
);


-- =========================================
-- 5. PAYMENTS
-- =========================================

CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,

    booking_id INT NOT NULL UNIQUE,

    amount DECIMAL(10,2) NOT NULL,

    payment_method ENUM(
        'UPI',
        'CARD',
        'CASH'
    ) NOT NULL,

    payment_status ENUM(
        'PENDING',
        'SUCCESS',
        'FAILED'
    ) NOT NULL DEFAULT 'PENDING',

    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_payment_amount
        CHECK (amount >= 0)
);