import React, { useState, useEffect } from 'react';
import { getBrandNamesByType } from '../services/brandApi'; // Assuming these API functions exist
import {getBrandNamesForAvailableStocks, getBrandTypesForAvailableStocks} from '../services/stocksApi'; // Assuming these API functions exist
import { addSale } from '../services/saleApi'; // Assuming these API functions exist


const SalesForm = () => {
    // Initialize state to hold form data
    const [saleData, setSaleData] = useState({
        id: '',
        userId: '',
        brandType: '',
        brandName: '',
        liquorQuantity: '',
        quantity: 0,
        mrp: 0.0,
        dateOfSale: '',
    });

    const [brandTypes, setBrandTypes] = useState([]); // Store brand types fetched from API
    const [brandNames, setBrandNames] = useState([]); // Store brand names fetched based on brand type
    const [brandTypeData, setBrandTypeData] = useState({});
    const [liquorQuantites, setLiquorQuantites] = useState([]); // Store brand names fetched based on brand type
    const [isFormValid, setIsFormValid] = useState(false); // Flag to enable/disable form submission
    const [loading, setLoading] = useState(true); // Flag to show loading state

    // Fetch available brand types when component mounts
    useEffect(() => {
        const fetchBrandTypes = async () => {
            try {
                const data = await getBrandTypesForAvailableStocks(1); // API call to fetch brand types
                setBrandTypes(data);
                setLoading(false); // Hide loading after fetching data
            } catch (error) {
                console.error('Error fetching brand types:', error);
                setLoading(false); // Hide loading even in case of error
            }
        };
        fetchBrandTypes();
    }, []);

    // Fetch brand names when brand type is selected
    useEffect(() => {
        const fetchBrandNames = async () => {
            if (saleData.brandType) {
                try {
                    const data = await getBrandNamesForAvailableStocks(1, saleData.brandType); // API call to fetch brand names based on brand type
                    setBrandNames(Object.keys(data));
                    setBrandTypeData(data)
                    console.log()
                } catch (error) {
                    console.error('Error fetching brand names:', error);
                }
            }
        };
        fetchBrandNames();
    }, [saleData.brandType]);

    // Validate form based on selections
    useEffect(() => {
        const { brandType, brandName, liquorQuantity, quantity, mrp, dateOfSale } = saleData;
        setIsFormValid(
            brandType && brandName && liquorQuantity && quantity && mrp && dateOfSale
        ); // Ensure all fields are filled
    }, [saleData]);

    function getLiquorQuantityByBrand(brandName) {
        return brandTypeData[brandName] || [];  // Return an empty array if the brand doesn't exist
    }
    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target; // Get 'name' and 'value' from the event target
        setSaleData((prevState) => ({
            ...prevState,
            [name]: value, // Update the specific field in the state
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // TODO remove this
            saleData.userId = 1;
            await addSale(saleData); // API call to add sale
            alert('Sale added successfully!');
            // Reset form or redirect if needed
            setSaleData({
                id: '',
                userId: '',
                brandType: '',
                brandName: '',
                liquorQuantity: '',
                quantity: 0,
                mrp: 0.0,
                dateOfSale: '',
            });
        } catch (error) {
            console.error('Error adding sale:', error);
            alert('Failed to add sale!');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Sales Form</h2>
            <form onSubmit={handleSubmit}>
                {/* Brand Type Dropdown */}
                <div className="form-group">
                    <label htmlFor="brandType">Brand Type</label>
                    {loading ? (
                        <p>Loading brand types...</p> // Show loading message while waiting for data
                    ) : (
                        <select
                            id="brandType"
                            className="form-control"
                            name="brandType"
                            value={saleData.brandType}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Brand Type</option>
                            {brandTypes.length > 0 ? (
                                brandTypes.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>No Brand Types Available</option>
                            )}
                        </select>
                    )}
                </div>

                {/* Brand Name Dropdown */}
                <div className="form-group mt-3">
                    <label htmlFor="brandName">Brand Name</label>
                    <select
                        id="brandName"
                        className="form-control"
                        name="brandName"
                        value={saleData.brandName}
                        onChange={handleInputChange}
                        disabled={!saleData.brandType} // Disable until a brand type is selected
                        required={saleData.brandType} // Make required if a brand type is selected
                    >
                        <option value="">Select Brand Name</option>
                        {brandNames.length > 0 ? (
                            brandNames.map((name, index) => (
                                <option key={index} value={name}>
                                    {name}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>No Brand Names Available</option>
                        )}
                    </select>
                </div>

                {/* Liquor Quantity */}
                <div className="form-group mt-3">
                    <label htmlFor="brandName">Liquor Quantity</label>
                    <select
                        id="liquorQuantity"
                        className="form-control"
                        name="liquorQuantity"
                        value={saleData.liquorQuantity}
                        onChange={handleInputChange}
                        disabled={!saleData.brandType && !saleData.brandName} // Disable until a brand type is selected
                        required={saleData.brandType && saleData.brandName} // Make required if a brand type is selected
                    >
                        <option value="">Select Liquor Quantity</option>
                        {getLiquorQuantityByBrand(saleData.brandName).length > 0 ? (
                            brandTypeData[saleData.brandName].map((name, index) => (
                                <option key={index} value={name}>
                                    {name}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>No Liquor Quantity Available</option>
                        )}
                    </select>
                </div>

                {/* Quantity */}
                <div className="form-group mt-3">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                        type="number"
                        className="form-control"
                        id="quantity"
                        name="quantity"
                        value={saleData.quantity}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* MRP */}
                <div className="form-group mt-3">
                    <label htmlFor="mrp">MRP</label>
                    <input
                        type="number"
                        className="form-control"
                        id="mrp"
                        name="mrp"
                        value={saleData.mrp}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Date of Sale */}
                <div className="form-group mt-3">
                    <label htmlFor="dateOfSale">Date of Sale</label>
                    <input
                        type="date"
                        className="form-control"
                        id="dateOfSale"
                        name="dateOfSale"
                        value={saleData.dateOfSale}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn btn-primary mt-3"
                    disabled={!isFormValid} // Disable if form is not valid
                >
                    Add Sale
                </button>
            </form>
        </div>
    );
};

export default SalesForm;
