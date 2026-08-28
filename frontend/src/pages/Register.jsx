import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister(event) {

        event.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            await registerUser({
                name,
                email,
                password
            });

            setMessage(
                "Registration successful. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);

        }
    }

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <div className="auth-logo">
                        <span>S</span>
                        SmartPark
                    </div>

                    <h1>
                        Create your account
                    </h1>

                    <p>
                        Register to start managing your parking.
                    </p>

                </div>


                <form onSubmit={handleRegister}>

                    <div className="form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Enter your name"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Create a password"
                            required
                        />

                    </div>


                    {message && (
                        <div className="form-message">
                            {message}
                        </div>
                    )}


                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"
                        }
                    </button>

                </form>


                <div className="auth-footer">

                    <span>
                        Already have an account?
                    </span>

                    <Link to="/login">
                        Sign in
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Register;