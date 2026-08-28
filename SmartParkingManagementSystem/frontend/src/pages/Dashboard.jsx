import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return (
        <div>

            <Navbar />

            <main className="page">

                <div className="page-header">

                    <div>
                        <p className="page-label">
                            DASHBOARD
                        </p>

                        <h1>
                            Welcome, {user?.name || "User"}
                        </h1>

                        <p>
                            Manage your vehicles, parking bookings
                            and payments from here.
                        </p>
                    </div>

                </div>


                <div className="dashboard-cards">

                    <div className="dashboard-card">
                        <span>AVAILABLE SLOTS</span>
                        <strong>22</strong>
                        <p>Parking spaces currently available</p>
                    </div>

                    <div className="dashboard-card">
                        <span>MY VEHICLES</span>
                        <strong>0</strong>
                        <p>Registered vehicles</p>
                    </div>

                    <div className="dashboard-card">
                        <span>MY BOOKINGS</span>
                        <strong>0</strong>
                        <p>Total parking reservations</p>
                    </div>

                </div>


                <div className="dashboard-section">

                    <div className="section-header">

                        <div>
                            <h2>
                                Quick Actions
                            </h2>

                            <p>
                                Common actions you can perform.
                            </p>
                        </div>

                    </div>


                    <div className="quick-actions">

                        <Link
                            to="/vehicles"
                            className="action-card"
                        >
                            <strong>
                                Manage Vehicles
                            </strong>

                            <span>
                                Add or remove your vehicles
                            </span>
                        </Link>


                        <Link
                            to="/parking"
                            className="action-card"
                        >
                            <strong>
                                Book Parking
                            </strong>

                            <span>
                                Find an available parking slot
                            </span>
                        </Link>


                        <Link
                            to="/bookings"
                            className="action-card"
                        >
                            <strong>
                                My Bookings
                            </strong>

                            <span>
                                View your parking reservations
                            </span>
                        </Link>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;