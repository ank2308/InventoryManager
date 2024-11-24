import React, { useState } from "react";
import axiosInstance from "../services/axiosInstance";

const AddUserForm = () => {
    // State to hold user data
    const [userData, setUserData] = useState({
        name: "",
        licenseNo: "",
        licenseExpiry: "",
        phoneNo: "",
        email: "",
        addresses: [
            {
                shopNo: "",
                area: "",
                city: "",
                state: "",
                pincode: "",
            },
        ],
    });

    // Handle input change for user and address fields
    const handleInputChange = (e, index, field) => {
        const { name, value } = e.target;
        if (name === "user") {
            setUserData({ ...userData, [field]: value });
        } else if (name === "address") {
            const newAddresses = [...userData.addresses];
            newAddresses[index][field] = value;
            setUserData({ ...userData, addresses: newAddresses });
        }
    };

    // Add a new address field
    const addAddress = () => {
        setUserData({
            ...userData,
            addresses: [
                ...userData.addresses,
                {
                    shopNo: "",
                    area: "",
                    city: "",
                    state: "",
                    pincode: "",
                },
            ],
        });
    };

    // Remove an address field
    const removeAddress = (index) => {
        const newAddresses = [...userData.addresses];
        newAddresses.splice(index, 1);
        setUserData({ ...userData, addresses: newAddresses });
    };

    // Submit the form data to the backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post("/api/user/add-user", userData); // Assuming your API endpoint is "/api/users"
            console.log("User created successfully:", response.data);
            // Reset the form
            setUserData({
                name: "",
                licenseNo: "",
                licenseExpiry: "",
                phoneNo: "",
                email: "",
                addresses: [
                    {
                        shopNo: "",
                        area: "",
                        city: "",
                        state: "",
                        pincode: "",
                    },
                ],
            });
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Add User</h2>
            <form onSubmit={handleSubmit}>
                {/* User Information Section */}
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={userData.name}
                        onChange={(e) => handleInputChange(e, null, "name")}
                        name="user"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="licenseNo">License No</label>
                    <input
                        type="text"
                        className="form-control"
                        id="licenseNo"
                        value={userData.licenseNo}
                        onChange={(e) => handleInputChange(e, null, "licenseNo")}
                        name="user"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="licenseExpiry">License Expiry</label>
                    <input
                        type="date"
                        className="form-control"
                        id="licenseExpiry"
                        value={userData.licenseExpiry}
                        onChange={(e) => handleInputChange(e, null, "licenseExpiry")}
                        name="user"
                        required
                    />
                </div>

                {/* Contact Information Section */}
                <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                        type="tel"
                        className="form-control"
                        id="phoneNo"
                        value={userData.phoneNo}
                        onChange={(e) => handleInputChange(e, null, "phoneNo")}
                        name="user"
                        pattern="[0-9]{10}"
                        placeholder="Enter 10-digit phone number"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={userData.email}
                        onChange={(e) => handleInputChange(e, null, "email")}
                        name="user"
                        required
                    />
                </div>

                {/* Address Section */}
                <h4>Addresses</h4>
                {userData.addresses.map((address, index) => (
                    <div key={index} className="form-row">
                        <div className="col-md-2">
                            <label htmlFor={`shopNo-${index}`}>Shop No</label>
                            <input
                                type="text"
                                className="form-control"
                                id={`shopNo-${index}`}
                                value={address.shopNo}
                                onChange={(e) => handleInputChange(e, index, "shopNo")}
                                name="address"
                                required
                            />
                        </div>

                        <div className="col-md-3">
                            <label htmlFor={`area-${index}`}>Area</label>
                            <input
                                type="text"
                                className="form-control"
                                id={`area-${index}`}
                                value={address.area}
                                onChange={(e) => handleInputChange(e, index, "area")}
                                name="address"
                                required
                            />
                        </div>

                        <div className="col-md-3">
                            <label htmlFor={`city-${index}`}>City</label>
                            <input
                                type="text"
                                className="form-control"
                                id={`city-${index}`}
                                value={address.city}
                                onChange={(e) => handleInputChange(e, index, "city")}
                                name="address"
                                required
                            />
                        </div>

                        <div className="col-md-2">
                            <label htmlFor={`state-${index}`}>State</label>
                            <input
                                type="text"
                                className="form-control"
                                id={`state-${index}`}
                                value={address.state}
                                onChange={(e) => handleInputChange(e, index, "state")}
                                name="address"
                                required
                            />
                        </div>

                        <div className="col-md-2">
                            <label htmlFor={`pincode-${index}`}>Pincode</label>
                            <input
                                type="text"
                                className="form-control"
                                id={`pincode-${index}`}
                                value={address.pincode}
                                onChange={(e) => handleInputChange(e, index, "pincode")}
                                name="address"
                                required
                            />
                        </div>

                        {/* Remove address button */}
                        {userData.addresses.length > 1 && (
                            <button
                                type="button"
                                className="btn btn-danger mt-4 ml-2"
                                onClick={() => removeAddress(index)}
                            >
                                Remove Address
                            </button>
                        )}
                    </div>
                ))}

                {/* Buttons */}
                <div className="d-flex justify-content-between mt-3">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addAddress}
                    >
                        Add Another Address
                    </button>

                    <button type="submit" className="btn btn-success">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddUserForm;
