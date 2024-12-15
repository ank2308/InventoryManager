import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import AuthContext from "../context/AuthContext";

const AddUsers = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [licenseNo, setLicenseNo] = useState("");
    const [roles, setRoles] = useState("USER");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Loader state
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (user?.role !== "ADMIN") {
    //         navigate("/unauthorized");
    //     }
    // }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await axiosInstance.post(`/api/auth/register`, {
                licenseNo,
                username,
                password,
                roles: [roles],
            });
            setMessage("User added successfully!");
            setLicenseNo("");
            setUsername("");
            setPassword("");
            setRoles("USER");
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setLicenseNo("");
        setUsername("");
        setPassword("");
        setRoles("USER");
        setMessage("");
        setError("");
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2>Register User For Application</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="licenseNo" className="form-label">License No</label>
                            <input
                                type="text"
                                id="licenseNo"
                                value={licenseNo}
                                onChange={(e) => setLicenseNo(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="roles" className="form-label">Role</label>
                            <select
                                id="roles"
                                value={roles}
                                onChange={(e) => setRoles(e.target.value)}
                                className="form-select"
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                        {loading && <div className="alert alert-info">Processing...</div>}
                        {message && <div className="alert alert-success">{message}</div>}
                        {error && <div className="alert alert-danger">{error}</div>}
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            Add User
                        </button>
                        <button type="button" className="btn btn-secondary w-100 mt-2" onClick={handleReset}>
                            Reset
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUsers;
