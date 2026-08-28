import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
    return (
        <div className="home-page">

            <Navbar />

            {/* Hero */}

            <section className="hero-section">

                <div className="container">

                    <p className="hero-label">
                        SMART PARKING MANAGEMENT SYSTEM
                    </p>

                    <h1>
                        Find. Reserve. Park.
                    </h1>

                    <p className="hero-text">
                        Find available parking spaces, manage your
                        vehicles and reserve your parking slot
                        quickly and easily.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/register"
                            className="btn-primary"
                        >
                            Get Started
                        </Link>

                        <Link
                            to="/login"
                            className="btn-secondary"
                        >
                            Login
                        </Link>

                    </div>

                </div>

            </section>


            {/* Features */}

            <section id="features" className="features-section">

                <div className="container">

                    <div className="section-heading">

                        <p>
                            FEATURES
                        </p>

                        <h2>
                            Simple parking management
                        </h2>

                    </div>


                    <div className="feature-grid">

                        <div className="feature-card">

                            <span className="card-number">
                                01
                            </span>

                            <h3>
                                Easy Booking
                            </h3>

                            <p>
                                Find available parking slots and
                                reserve one based on your preferred
                                date and time.
                            </p>

                        </div>


                        <div id="vehicles" className="feature-card">

                            <span className="card-number">
                                02
                            </span>

                            <h3>
                                Vehicle Management
                            </h3>

                            <p>
                                Add and manage your vehicles and
                                select the appropriate vehicle
                                while making a booking.
                            </p>

                        </div>


                        <div className="feature-card">

                            <span className="card-number">
                                03
                            </span>

                            <h3>
                                Booking Management
                            </h3>

                            <p>
                                View your current and previous
                                parking reservations in one place.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* How It Works */}

            <section id="how-it-works" className="steps-section">

                <div className="container">

                    <div className="section-heading">

                        <p>
                            HOW IT WORKS
                        </p>

                        <h2>
                            Four simple steps
                        </h2>

                    </div>


                    <div className="steps-grid">

                        <div className="step-card">

                            <div className="step-number">
                                01
                            </div>

                            <h3>
                                Register
                            </h3>

                            <p>
                                Create your SmartPark account.
                            </p>

                        </div>


                        <div className="step-card">

                            <div className="step-number">
                                02
                            </div>

                            <h3>
                                Add Vehicle
                            </h3>

                            <p>
                                Register your vehicle details.
                            </p>

                        </div>


                        <div className="step-card">

                            <div className="step-number">
                                03
                            </div>

                            <h3>
                                Select Slot
                            </h3>

                            <p>
                                Choose an available parking slot.
                            </p>

                        </div>


                        <div className="step-card">

                            <div className="step-number">
                                04
                            </div>

                            <h3>
                                Confirm
                            </h3>

                            <p>
                                Confirm your booking and payment.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* CTA */}

            <section className="cta-section">

                <div className="container">

                    <h2>
                        Ready to get started?
                    </h2>

                    <p>
                        Create your account and start managing
                        your parking reservations.
                    </p>

                    <Link
                        to="/register"
                        className="btn-primary"
                    >
                        Create Account
                    </Link>

                </div>

            </section>


            {/* Footer */}

            <footer className="footer">

                <div className="container footer-content">

                    <div>
                        <strong>
                            SmartPark
                        </strong>

                        <p>
                            Smart Parking Management System
                        </p>
                    </div>

                    <p>
                        © 2026 SmartPark
                    </p>

                </div>

            </footer>

        </div>
    );
}

export default Home;