import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    function handleLogout() {
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <nav className="navbar">

            <div className="navbar-container">

                <Link
                    to={user ? "/dashboard" : "/"}
                    className="navbar-logo"
                >
                    <span className="logo-mark">
                        S
                    </span>

                    <span className="logo-text">
                        Smart<span>Park</span>
                    </span>
                </Link>


                {user ? (

                    <>
                        <div className="navbar-links">

                            <Link to="/dashboard">
                                Dashboard
                            </Link>

                            <Link to="/vehicles">
                                Vehicles
                            </Link>

                            <Link to="/parking">
                                Book Parking
                            </Link>

                            <Link to="/bookings">
                                Bookings
                            </Link>

                            {user.role === "ADMIN" && (
                                <Link to="/admin">
                                    Admin
                                </Link>
                            )}

                        </div>


                        <div className="navbar-user">

                            <div className="user-avatar">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>

                            <span className="user-name">
                                {user.name}
                            </span>

                            <button
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </div>
                    </>

                ) : (

                    <>
                        <div className="navbar-links guest-links">

                            <a href="#features">
                                Features
                            </a>

                            <a href="#how-it-works">
                                How It Works
                            </a>

                            <a href="#vehicles">
                                Vehicle Support
                            </a>

                        </div>


                        <div className="guest-actions">

                            <Link
                                to="/login"
                                className="signin-link"
                            >
                                Sign In
                            </Link>

                            <Link
                                to="/register"
                                className="nav-cta"
                            >
                                Get Started
                            </Link>

                        </div>
                    </>

                )}

            </div>

        </nav>
    );
}

export default Navbar;