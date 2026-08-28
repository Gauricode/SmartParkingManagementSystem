INSERT INTO bookings
(user_id, vehicle_id, slot_id, booking_date, start_time, end_time, booking_status)
VALUES
(1, 2, 11, '2026-08-25', '09:00:00', '11:00:00', 'CONFIRMED'),

(2, 3, 13, '2026-08-25', '10:00:00', '12:00:00', 'CONFIRMED'),

(3, 5, 19, '2026-08-26', '08:00:00', '10:00:00', 'CONFIRMED'),

(4, 7, 5, '2026-08-26', '14:00:00', '16:00:00', 'CANCELLED'),

(5, 9, 20, '2026-08-27', '11:00:00', '14:00:00', 'COMPLETED');