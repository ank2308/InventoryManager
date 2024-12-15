import React, { useState } from "react";
import axiosInstance from "../services/axiosInstance";

const AddUserForm = () => {
    // State to hold user data
    const [userData, setUserData] = useState({
        username: "",
        name: "",
        phoneNo: "",
        email: "",
        shops: [
            {
                shopName: "",
                shopNo: "",
                licenseNo: "",
                licenseExpiry: "",
                shopPhoneNumber: "",
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
        } else if (name === "shop") {
            const newShops = [...userData.shops];
            newShops[index][field] = value;
            setUserData({ ...userData, shops: newShops });
        }
    };

    // Add a new shop field
    const addShop = () => {
        setUserData({
            ...userData,
            shops: [
                ...userData.shops,
                {
                    shopName: "",
                    shopNo: "",
                    licenseNo: "",
                    licenseExpiry: "",
                    shopPhoneNo: "",
                    area: "",
                    city: "",
                    state: "",
                    pincode: "",
                },
            ],
        });
    };

    // Remove an address field
    const removeShop = (index) => {
        const newShops = [...userData.shops];
        newShops.splice(index, 1);
        setUserData({ ...userData, shops: newShops });
    };

    // Submit the form data to the backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post("/api/user/add-user", userData); // Assuming your API endpoint is "/api/users"
            console.log("User created successfully:", response.data);
            // Reset the form
            setUserData({
                username:"",
                name: "",
                phoneNo: "",
                email: "",
                shops: [
                    {
                        shopName: "",
                        shopNo: "",
                        licenseNo: "",
                        licenseExpiry: "",
                        shopPhoneNo: "",
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
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={userData.username}
                        onChange={(e) => handleInputChange(e, null, "username")}
                        name="user"
                        required
                    />
                </div>
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

                {/* Contact Information Section */}
                <div className="form-group">
                    <label htmlFor="phoneNo">Phone</label>
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
                <h4>Shops</h4>
                {userData.shops.map((shop, index) => (
                    <div key={index}>
                    <div className="form-row">
                    <div className="col-md-2">
                            <label htmlFor={`shopName-${index}`}>Shop Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id={`shopName-${index}`}
                                value={shop.shopName}
                                onChange={(e) => handleInputChange(e, index, "shopName")}
                                name="shop"
                                required
                            />
                        </div>

                        <div className="col-md-2">
                            <label htmlFor={`shopNo-${index}`}>Shop No</label>
                            <input
                                type="text"
                                className="form-control"
                                id={`shopNo-${index}`}
                                value={shop.shopNo}
                                onChange={(e) => handleInputChange(e, index, "shopNo")}
                                name="shop"
                                required
                            />
                        </div>

                        <div className="col-md-2">
                            <label htmlFor={`licenseNo-${index}`}>License No</label>
                            <input
                                type="text"
                                className="form-control"
                                id={`licenseNo-${index}`}
                                value={shop.licenseNo}
                                onChange={(e) => handleInputChange(e, index, "licenseNo")}
                                name="shop"
                                required
                            />
                        </div>

                        <div className="col-md-2">
                            <label htmlFor={`licenseExpiry-${index}`}>License Expiry</label>
                            <input
                                type="date"
                                className="form-control"
                                id={`licenseExpiry-${index}`}
                                value={shop.licenseExpiry}
                                onChange={(e) => handleInputChange(e, index, "licenseExpiry")}
                                name="shop"
                                required
                            />
                        </div>
                        </div>

                        <div className="col-md-2">
                            <label htmlFor={`shopPhoneNumber-${index}`}>Shop Phone Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                id={`shopPhoneNumber-${index}`}
                                value={shop.shopPhoneNumber}
                                onChange={(e) => handleInputChange(e, index, "shopPhoneNumber")}
                                name="shop"
                                pattern="[0-9]{10}"
                                placeholder="Enter 10-digit phone number"
                                required
                            />
                        </div>

                        <div key={index} className="form-row">
                        <div className="col-md-3">
                            <label htmlFor={`area-${index}`}>Area</label>
                            <input
                                type="text"
                                className="form-control"
                                id={`area-${index}`}
                                value={shop.area}
                                onChange={(e) => handleInputChange(e, index, "area")}
                                name="shop"
                                required
                            />
                        </div>

                        <div className="col-md-3">
                            <label htmlFor={`city-${index}`}>City</label>
                            <input
                                type="text"
                                className="form-control"
                                id={`city-${index}`}
                                value={shop.city}
                                onChange={(e) => handleInputChange(e, index, "city")}
                                name="shop"
                                required
                            />
                        </div>

                        <div className="col-md-2">
                            <label htmlFor={`state-${index}`}>State</label>
                            <input
                                type="text"
                                className="form-control"
                                id={`state-${index}`}
                                value={shop.state}
                                onChange={(e) => handleInputChange(e, index, "state")}
                                name="shop"
                                required
                            />
                        </div>

                        <div className="col-md-2">
                            <label htmlFor={`pincode-${index}`}>Pincode</label>
                            <input
                                type="text"
                                className="form-control"
                                id={`pincode-${index}`}
                                value={shop.pincode}
                                onChange={(e) => handleInputChange(e, index, "pincode")}
                                name="shop"
                                required
                            />
                        </div>

                        {/* Remove address button */}
                        {userData.shops.length > 1 && (
                            <button
                                type="button"
                                className="btn btn-danger mt-4 ml-2"
                                onClick={() => removeShop(index)}
                            >
                                Remove Shop
                            </button>
                        )}
                    </div>
                    </div>
                ))}

                {/* Buttons */}
                <div className="d-flex justify-content-between mt-3">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addShop}
                    >
                        Add Another Shop
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
