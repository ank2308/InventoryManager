import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";

const ManageUsersPage = () => {
    const [users, setUsers] = useState([]); // Stores paginated user data
    const [selectedUser, setSelectedUser] = useState(null); // Stores selected user's details
    const [isEditing, setIsEditing] = useState(false); // Tracks editing mode
    const [formData, setFormData] = useState({ addresses: [] }); // Stores form data, including addresses
    const [page, setPage] = useState(0); // Current page
    const [size, setSize] = useState(5); // Number of users per page
    const [totalPages, setTotalPages] = useState(0); // Total pages
    const [loading, setLoading] = useState(false); // Loading indicator

    // Fetch users (paginated) on component load or page change
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/api/user/getAllUsers`, {
                    params: { page, size },
                });
                console.log("User Data {}", response.data.content);
                setUsers(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [page, size]);

    // Fetch full details of a user, including addresses
    const handleRowClick = async (user) => {
        // Toggle the modal if the same user row is clicked again
        if (selectedUser?.id === user.id) {
            setSelectedUser(null);
            setFormData({ addresses: [] });
            setIsEditing(false);
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.get(`/api/user/${user.id}`);
            setSelectedUser(response.data);
            setFormData({
                ...response.data,
                addresses: response.data.addresses || [], // Ensure addresses is an array
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error fetching user details:", error);
            setFormData({ addresses: [] }); // Fallback to default
        } finally {
            setLoading(false);
        }
    };

    // Handle input change for form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    // Handle input change for address fields
    const handleAddressChange = (index, e) => {
        const { name, value } = e.target;
        const updatedAddresses = [...formData.addresses];

        // Ensure the address at the given index exists
        if (!updatedAddresses[index]) {
            updatedAddresses[index] = {};
        }

        updatedAddresses[index][name] = value; // Update the specific field
        setFormData((prevState) => ({ ...prevState, addresses: updatedAddresses }));
    };

    // Save updated user details
    const handleSaveClick = async () => {
        console.log("Saving user data:", formData); // Log the formData for debugging
        try {
            await axiosInstance.put(`/api/user/${formData.id}`, formData);
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === formData.id ? { ...user, ...formData } : user
                )
            );
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    // Delete a user
    const handleDeleteClick = async () => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axiosInstance.delete(`/api/user/${formData.id}`);
                setUsers((prevUsers) =>
                    prevUsers.filter((user) => user.id !== formData.id)
                );
                setSelectedUser(null);
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Manage Users</h2>

            {loading && <div className="spinner-border text-primary mb-3" role="status"></div>}

            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Username</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <React.Fragment key={user.id}>
                        <tr onClick={() => handleRowClick(user)}>
                            <td>{user.name}</td>
                            <td>{user.username}</td>
                        </tr>
                        {selectedUser?.id === user.id && (
                            <tr>
                                <td colSpan="2">
                                    <div className="card p-4">
                                        <h5>Edit User</h5>
                                        <form>
                                            <div className="mb-3">
                                                <label>Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name || ""}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label>License No</label>
                                                <input
                                                    type="text"
                                                    name="licenseNo"
                                                    value={formData.licenseNo || ""}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label>License Expiry</label>
                                                <input
                                                    type="date"
                                                    name="licenseExpiry"
                                                    value={formData.licenseExpiry || ""}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label>Phone No</label>
                                                <input
                                                    type="text"
                                                    name="phoneNo"
                                                    value={formData.phoneNo || ""}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label>Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email || ""}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <h6>Addresses</h6>
                                            {formData.addresses?.map((address, index) => (
                                                <div key={index} className="mb-3">
                                                    <label>Shop No</label>
                                                    <input
                                                        type="text"
                                                        name="shopNo"
                                                        value={address.shopNo || ""}
                                                        onChange={(e) => handleAddressChange(index, e)}
                                                        className="form-control"
                                                        disabled={!isEditing}
                                                    />
                                                    <label>City</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={address.city || ""}
                                                        onChange={(e) => handleAddressChange(index, e)}
                                                        className="form-control"
                                                        disabled={!isEditing}
                                                    />
                                                    <label>Area</label>
                                                    <input
                                                        type="text"
                                                        name="area"
                                                        value={address.area || ""}
                                                        onChange={(e) => handleAddressChange(index, e)}
                                                        className="form-control"
                                                        disabled={!isEditing}
                                                    />
                                                    <label>State</label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        value={address.state || ""}
                                                        onChange={(e) => handleAddressChange(index, e)}
                                                        className="form-control"
                                                        disabled={!isEditing}
                                                    />
                                                    <label>Pincode</label>
                                                    <input
                                                        type="text"
                                                        name="pincode"
                                                        value={address.pincode || ""}
                                                        onChange={(e) => handleAddressChange(index, e)}
                                                        className="form-control"
                                                        disabled={!isEditing}
                                                    />
                                                </div>
                                            ))}
                                            <div className="d-flex justify-content-between">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => setIsEditing(true)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={handleDeleteClick}
                                                    disabled={isEditing}
                                                >
                                                    Delete
                                                </button>
                                                {isEditing && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-success"
                                                        onClick={handleSaveClick}
                                                    >
                                                        Save
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center">
                <button
                    className="btn btn-secondary"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                >
                    Previous
                </button>
                <span>
                    Page {page + 1} of {totalPages}
                </span>
                <button
                    className="btn btn-secondary"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={page >= totalPages - 1}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ManageUsersPage;
