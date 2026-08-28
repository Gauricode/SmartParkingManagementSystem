INSERT INTO payments
(booking_id, amount, payment_method, payment_status, payment_date)
VALUES
(1, 120.00, 'UPI', 'SUCCESS', '2026-08-25 08:45:00'),

(2, 180.00, 'CARD', 'SUCCESS', '2026-08-25 09:40:00'),

(3, 300.00, 'CASH', 'SUCCESS', '2026-08-26 07:45:00'),

(4, 100.00, 'UPI', 'FAILED', '2026-08-26 13:45:00'),

(5, 350.00, 'CARD', 'SUCCESS', '2026-08-27 10:30:00');