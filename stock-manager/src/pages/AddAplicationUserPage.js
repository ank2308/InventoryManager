import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";

const AddApplicationUserPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("USER");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Fetch users without AppUser
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get("/api/user/without-appuser");
                setUsers(response.data);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };
        fetchUsers();
    }, []);

    const handleGeneratePassword = (user) => {
        setSelectedUser(user);
        setPassword("");
        setRole("USER");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;

        try {
            const response = await axiosInstance.post("/api/auth/register", {
                username: selectedUser.username,
                password,
                roles: [role],
            });
            setMessage("AppUser created successfully!");
            setUsers((prev) => prev.filter((u) => u.username !== selectedUser.username));
            setSelectedUser(null);
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div className="container mt-4">
            <h2>User Management</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Name</th>
                    <th>License No</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.name}</td>
                        <td>{user.licenseNo}</td>
                        <td>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleGeneratePassword(user)}
                            >
                                Generate Password
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Modal */}
            {selectedUser && (
                <div className="modal show d-block" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create AppUser</h5>
                                <button className="btn-close" onClick={() => setSelectedUser(null)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <input
                                            type="text"
                                            id="username"
                                            value={selectedUser.username}
                                            readOnly
                                            className="form-control"
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
                                        <label htmlFor="role" className="form-label">Role</label>
                                        <select
                                            id="role"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="USER">USER</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                    </div>
                                    {message && <div className="alert alert-success">{message}</div>}
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    <button type="submit" className="btn btn-primary w-100">
                                        Create AppUser
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddApplicationUserPage;
