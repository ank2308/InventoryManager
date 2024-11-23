import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {addBrandType, getBrandTypes} from "../services/brandApi";
import {getQuantities, getQuantitiesByBrandName} from "../services/quantityApi";

const AddBrandPage = () => {
    const [brandType, setBrandType] = useState('');
    const [brandName, setBrandName] = useState('');
    const [quantities, setQuantities] = useState([]);
    const [selectedQuantities, setSelectedQuantities] = useState([]);
    const [brandTypes, setBrandTypes] = useState([]);
    const [message, setMessage] = useState('');
    const [isNewBrandType, setIsNewBrandType] = useState(false);
    const [newBrandType, setNewBrandType] = useState('');

    useEffect(() => {
        // Fetch all brand types
        getBrandTypes()
            .then((response) => {
                setBrandTypes(response.data);
            })
            .catch((error) => {
                console.error('Error fetching brand types:', error);
            });
        // Fetch quantities from the API
        getQuantities()
            .then(response => {
                setQuantities(response.data);
            })
            .catch(error => {
                console.error('Error fetching quantities', error);
            });
    }, []);

    // Handle checkbox change
    const handleCheckboxChange = (event) => {
        const value = event.target.value;
        setSelectedQuantities((prevSelected) => {
            if (prevSelected.includes(value)) {
                return prevSelected.filter((item) => item !== value);
            } else {
                return [...prevSelected, value];
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const brandDetails = {
            brandName: brandName,
            brandType: isNewBrandType ? newBrandType : brandType
        };

        const brandNameRequest = {
            brandDetails: brandDetails,
            quantityIds: selectedQuantities
        };

        // API call to add a new Brand Name
        addBrandType(brandNameRequest)
            .then((response) => {
                if (response.status === 200) {
                    setMessage('Brand Name added successfully');
                    setBrandName(''); // Reset the brand name input
                    setNewBrandType(''); // Reset the new brand type input
                    setBrandType(''); // Reset the selected brand type
                    setSelectedQuantities([])
                } else if (response.status === 400) {
                    console.log(response.data)
                    // Bad Request: 400 (e.g., duplicate brand name)
                    const data = response.json();
                    alert(`Error: ${data.message}`);
                    setMessage(`Error: ${response.data}`)
                } else if (response.status === 500) {
                    // Internal Server Error: 500
                    alert('Something went wrong on the server. Please try again later.');
                } else {
                    // Handle other unexpected status codes
                    alert('Unexpected error occurred.');
                }
            })
            .catch((error) => {
                console.log('err res', error.response)
                if (error.response) {
                    if (error.response.status === 400) {
                        setMessage(`Error: ${error.response.data}`)
                    } else if (error.response.status === 500) {
                        alert('Something went wrong on the server. Please try again later.');
                    } else {
                        alert('Unexpected error occurred.');
                    }
                }
            });
    };

    const handleToggleNewBrandType = () => {
        setIsNewBrandType(!isNewBrandType);
        setNewBrandType(''); // Reset the input when toggling
    };

    return (
        <div className="container">
            <h2>Add New Brand Name</h2>
            <form onSubmit={handleSubmit}>
                {/* Brand Type Selection / Creation */}
                <div className="form-group">
                    <label htmlFor="brandType">Brand Type</label>
                    <div className="d-flex align-items-center">
                        <select
                            className="form-control"
                            id="brandType"
                            value={brandType}
                            onChange={(e) => setBrandType(e.target.value)}
                            disabled={isNewBrandType} // Disable if the user is creating a new brand type
                        >
                            <option value="">Select Brand Type</option>
                            {brandTypes.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            className="btn btn-link ml-3"
                            onClick={handleToggleNewBrandType}
                        >
                            {isNewBrandType ? 'Cancel New Brand Type' : 'Add New Brand Type'}
                        </button>
                    </div>

                    {/* If creating a new Brand Type, show the input field */}
                    {isNewBrandType && (
                        <input
                            type="text"
                            className="form-control mt-2"
                            placeholder="Enter New Brand Type"
                            value={newBrandType}
                            onChange={(e) => setNewBrandType(e.target.value)}
                            required
                        />
                    )}
                </div>

                {/* Brand Name Input */}
                <div className="form-group">
                    <label htmlFor="brandName">Brand Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="brandName"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        required
                    />
                </div>

                {/* Quantity Checkboxes */}
                {quantities.length > 0 && (
                    <div className="form-group mt-4">
                        <label>Quantities Available</label>
                        <div>
                            {quantities.map((quantity) => (
                                <div key={quantity.id} className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`quantity-${quantity.id}`}
                                        value={quantity.id}
                                        onChange={handleCheckboxChange}
                                        checked={selectedQuantities.includes(String(quantity.id))}
                                    />
                                    <label className="form-check-label" htmlFor={`quantity-${quantity.id}`}>
                                        {quantity.quantityName} - {quantity.quantity} ml
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {message && <div className="alert alert-info">{message}</div>}

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary">
                    Add Brand Name
                </button>
            </form>
        </div>
    );
};

export default AddBrandPage;
