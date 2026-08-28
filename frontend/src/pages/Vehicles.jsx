import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
    getUserVehicles,
    addVehicle,
    deleteVehicle
} from "../services/api";

function Vehicles() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [vehicles, setVehicles] = useState([]);

    const [vehicleNumber, setVehicleNumber] = useState("");
    const [vehicleType, setVehicleType] = useState(
        "FOUR_WHEELER"
    );

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    async function loadVehicles() {

        try {

            const data = await getUserVehicles(
                user.user_id
            );

            setVehicles(data);

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Unable to load vehicles"
            );

        }
    }


    useEffect(() => {

        if (user?.user_id) {
            loadVehicles();
        }

    }, []);


    async function handleAddVehicle(event) {

        event.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            await addVehicle({
                user_id: user.user_id,
                vehicle_number: vehicleNumber,
                vehicle_type: vehicleType
            });

            setVehicleNumber("");

            setMessage(
                "Vehicle added successfully"
            );

            loadVehicles();

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Unable to add vehicle"
            );

        } finally {

            setLoading(false);

        }
    }


    async function handleDelete(vehicleId) {

        try {

            await deleteVehicle(vehicleId);

            setMessage(
                "Vehicle deleted successfully"
            );

            loadVehicles();

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Unable to delete vehicle"
            );
        }
    }


    return (
        <div>

            <Navbar />

            <main className="page">

                <div className="page-header">

                    <p className="page-label">
                        VEHICLES
                    </p>

                    <h1>
                        My Vehicles
                    </h1>

                    <p>
                        Add and manage vehicles associated
                        with your account.
                    </p>

                </div>


                <div className="vehicle-layout">

                    {/* ADD VEHICLE */}

                    <div className="simple-card">

                        <h2>
                            Add Vehicle
                        </h2>

                        <p className="card-description">
                            Enter your vehicle details below.
                        </p>


                        <form onSubmit={handleAddVehicle}>

                            <div className="form-group">

                                <label>
                                    Vehicle Number
                                </label>

                                <input
                                    type="text"
                                    value={vehicleNumber}
                                    onChange={(e) =>
                                        setVehicleNumber(
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    placeholder="KL01AB1234"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Vehicle Type
                                </label>

                                <select
                                    value={vehicleType}
                                    onChange={(e) =>
                                        setVehicleType(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="TWO_WHEELER">
                                        Two Wheeler
                                    </option>

                                    <option value="FOUR_WHEELER">
                                        Four Wheeler
                                    </option>

                                    <option value="HEAVY_VEHICLE">
                                        Heavy Vehicle
                                    </option>

                                </select>

                            </div>


                            {message && (
                                <div className="form-message">
                                    {message}
                                </div>
                            )}


                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading
                                    ? "Adding..."
                                    : "Add Vehicle"
                                }
                            </button>

                        </form>

                    </div>


                    {/* VEHICLE LIST */}

                    <div className="simple-card">

                        <h2>
                            Registered Vehicles
                        </h2>

                        <p className="card-description">
                            Vehicles registered under your account.
                        </p>


                        {vehicles.length === 0 ? (

                            <div className="empty-state">
                                No vehicles registered yet.
                            </div>

                        ) : (

                            <div className="vehicle-list">

                                {vehicles.map((vehicle) => (

                                    <div
                                        className="vehicle-row"
                                        key={vehicle.vehicle_id}
                                    >

                                        <div>

                                            <strong>
                                                {vehicle.vehicle_number}
                                            </strong>

                                            <span>
                                                {vehicle.vehicle_type}
                                            </span>

                                        </div>


                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                handleDelete(
                                                    vehicle.vehicle_id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Vehicles;