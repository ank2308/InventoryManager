import React, { useState, useEffect } from 'react';
import { getBrandNamesForAvailableStocks, getBrandTypesForAvailableStocks } from '../services/stocksApi';
import { addSale } from '../services/saleApi';

const SalesForm = () => {
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

    const [brandTypes, setBrandTypes] = useState([]);
    const [brandNames, setBrandNames] = useState([]);
    const [brandTypeData, setBrandTypeData] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(sessionStorage.getItem('user')); // Parse user from session storage

    useEffect(() => {
        const fetchBrandTypes = async () => {
            try {
                const data = await getBrandTypesForAvailableStocks(user.userId);
                setBrandTypes(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching brand types:', error);
                setLoading(false);
            }
        };
        fetchBrandTypes();
    }, [user.userId]);

    useEffect(() => {
        const fetchBrandNames = async () => {
            if (saleData.brandType) {
                try {
                    const data = await getBrandNamesForAvailableStocks(user.userId, saleData.brandType);
                    setBrandNames(Object.keys(data)); // Extract brand names as keys
                    setBrandTypeData(data); // Store the full map for quantities
                } catch (error) {
                    console.error('Error fetching brand names:', error);
                }
            }
        };
        fetchBrandNames();
    }, [saleData.brandType, user.userId]);

    useEffect(() => {
        const { brandType, brandName, liquorQuantity, quantity, mrp, dateOfSale } = saleData;
        setIsFormValid(brandType && brandName && liquorQuantity && quantity > 0 && mrp > 0 && dateOfSale);
    }, [saleData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSaleData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addSale({ ...saleData, userId: user.userId });
            alert('Sale added successfully!');
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
                <div className="form-group">
                    <label htmlFor="brandType">Brand Type</label>
                    {loading ? (
                        <p>Loading brand types...</p>
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
                            {brandTypes.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
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
                        value={saleData.brandName}
                        onChange={handleInputChange}
                        disabled={!saleData.brandType}
                        required={!!saleData.brandType}
                    >
                        <option value="">Select Brand Name</option>
                        {brandNames.map((name, index) => (
                            <option key={index} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group mt-3">
                    <label htmlFor="liquorQuantity">Liquor Quantity</label>
                    <select
                        id="liquorQuantity"
                        className="form-control"
                        name="liquorQuantity"
                        value={saleData.liquorQuantity}
                        onChange={handleInputChange}
                        disabled={!saleData.brandName}
                        required={!!saleData.brandName}
                    >
                        <option value="">Select Liquor Quantity</option>
                        {brandTypeData[saleData.brandName]?.map((item, index) => (
                            <option key={index} value={item.id}>
                                {item.displayValue}
                            </option>
                        ))}
                    </select>
                </div>

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

                <button type="submit" className="btn btn-primary mt-3" disabled={!isFormValid}>
                    Add Sale
                </button>
            </form>
        </div>
    );
};

export default SalesForm;
