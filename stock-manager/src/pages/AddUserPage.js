// src/pages/AddUserPage.js
import React, { useState } from "react";
import axiosInstance from "../services/axiosInstance";

const AddUserPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [roles, setRoles] = useState("USER"); // Default role
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await axiosInstance.post(`/api/auth/register`, {
                username,
                password,
                roles: [roles],
            });
            setMessage("User added successfully!");
            setUsername("");
            setPassword("");
            setRoles("USER");
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="text-center">Add AppUser</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
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
                        {message && <div className="alert alert-success">{message}</div>}
                        {error && <div className="alert alert-danger">{error}</div>}
                        <button type="submit" className="btn btn-primary w-100">Add User</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUserPage;
