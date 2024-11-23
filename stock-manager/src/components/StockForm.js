// src/components/StockForm.js
import React, {useEffect, useState} from 'react';
import {addStock, getBrandTypesForAvailableStocks} from '../services/stocksApi';
import {getBrandTypes, getBrandNamesByType} from "../services/brandApi";

const StockForm = () => {
    const [brandTypes, setBrandTypes] = useState([]); // Store brand types fetched from API
    const [brandNames, setBrandNames] = useState([]); // Store brand names fetched based on brand type
    const [isFormValid, setIsFormValid] = useState(false); // Flag to enable/disable form submission
    const [loading, setLoading] = useState(true); // Flag to show loading state

    const [stockData, setStockData] = useState({
        brandName: '',
        brandType: '',
        crateLotSize: 0,
        crateQuantity: 0,
        liquorQuantityInCrate: '',
        mrp: 0.0,
        marginPrice: 0.0,
        dateOfMgf: ''
    });

    // Fetch available brand types when component mounts
    useEffect((userId) => {
        const fetchBrandTypes = async () => {
            try {
                 await getBrandTypes()
                    .then((response) => {
                        setBrandTypes(response.data);
                    })
                    .catch((error) => {
                        console.error('Error fetching brand types:', error);
                    });
                setLoading(false); // Hide loading after fetching data
            } catch (error) {
                console.error('Error fetching brand types:', error);
                setLoading(false); // Hide loading after fetching data
            }
        };
        fetchBrandTypes();
    }, []);

    // Fetch brand names when brand type is selected
    useEffect(() => {
        const fetchBrandNames = async () => {
            if (stockData.brandType) {
                try {
                    const data = await getBrandNamesByType(stockData.brandType); // API call to fetch brand names based on brand type
                    setBrandNames(data);
                } catch (error) {
                    console.error('Error fetching brand names:', error);
                }
            }
        };
        fetchBrandNames();
    }, [stockData.brandType]);

    // Validate form based on selections
    useEffect(() => {
        const { brandType, brandName, crateLotSize, crateQuantity, liquorQuantityInCrate, mrp, dateOfMgf } = stockData;
        setIsFormValid(
            brandType && brandName && crateLotSize && crateQuantity && liquorQuantityInCrate && mrp && dateOfMgf
        ); // Ensure all fields are filled
    }, [stockData]);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStockData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addStock(stockData); // API call to add stock
            alert('Stock added successfully!');
            // Reset form or redirect if needed
            setStockData({
                brandName: '',
                brandType: '',
                crateLotSize: 0,
                crateQuantity: 0,
                liquorQuantityInCrate: '',
                mrp: 0.0,
                marginPrice: 0.0,
                dateOfMgf: '',
            });
        } catch (error) {
            console.error('Error adding stock:', error);
            alert('Failed to add stock!');
        }
    };

    return (
        <div className="card p-4">
            <h5>Add New Stock</h5>
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
                            value={stockData.brandType}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Brand Type</option>
                            {brandTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="form-group mt-3">
                    <label htmlFor="brandName">Brand Name</label>
                    <select
                        id="brandName"
                        className="form-control"
                        name="brandName"
                        value={stockData.brandName}
                        onChange={handleInputChange}
                        disabled={!stockData.brandType} // Disable until a brand type is selected
                        required={stockData.brandType} // Make required if a brand type is selected
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

                {/* Crate lot size */}
                <div className="form-group mt-3">
                    <label htmlFor="crateLotSize">Crate Lot Size</label>
                    <input
                        type="number"
                        className="form-control"
                        name="crateLotSize"
                        value={stockData.crateLotSize}
                        disabled={!stockData.brandType} // Disable if no brand type selected
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Crate quantity */}
                <div className="form-group mt-3">
                    <label htmlFor="crateQuantity">Crate Quantity</label>
                    <input
                        type="number"
                        className="form-control"
                        name="crateQuantity"
                        value={stockData.crateQuantity}
                        disabled={!stockData.brandType} // Disable if no brand type selected
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Liquor Quantity in Crate*/}
                <div className="form-group mt-3">
                    <label>Liquor Quantity in Crate</label>
                    <input
                        type="number"
                        className="form-control"
                        name="liquorQuantityInCrate"
                        value={stockData.liquorQuantityInCrate}
                        placeholder="Enter quantity"
                        disabled={!stockData.brandType} // Disable if no brand type selected
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Mrp */}
                <div className="form-group mt-3">
                    <label>Price (MRP)</label>
                    <input
                        type="number"
                        className="form-control"
                        name="mrp"
                        value={stockData.mrp}
                        placeholder="Enter MRP"
                        disabled={!stockData.brandType} // Disable if no brand type selected
                        onChange={handleInputChange}
                        required
                    />
                </div>


                {/* Margin price */}
                <div className="form-group mt-3">
                    <label>Margin Price</label>
                    <input
                        type="number"
                        className="form-control"
                        name="marginPrice"
                        value={stockData.marginPrice}
                        placeholder="Enter margin Price"
                        disabled={!stockData.brandType} // Disable if no brand type selected
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Date of Manufacture (disabled if no brand type selected) */}
                <div className="form-group mt-3">
                    <label htmlFor="dateOfMgf">Date of Manufacture</label>
                    <input
                        type="date"
                        className="form-control"
                        name="dateOfMgf"
                        value={stockData.dateOfMgf}
                        disabled={!stockData.brandType} // Disable if no brand type selected
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
                    Add Stock
                </button>
            </form>
        </div>
    );
};

export default StockForm;
