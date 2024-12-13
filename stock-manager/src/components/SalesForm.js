import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // Import react-select
import {
    getBrandNamesForAvailableStocks,
    getBrandTypesForAvailableStocks,
    getQuantitiesForAvailableStocks
} from '../services/stocksApi';
import { addSale } from '../services/saleApi';
import {getBrandDetailsById} from "../services/brandApi";

const SalesForm = () => {
    const [saleData, setSaleData] = useState({
        id: '',
        userId: '',
        brandType: '',
        brandName: '',
        quantityId: '',
        quantity: 0,
        mrp: 0.0,
        dateOfSale: '',
        brandQuantityId: '',
    });

    const [brandTypes, setBrandTypes] = useState([]);
    const [selectedBrandType, setSelectedBrandType] = useState(null);

    const [brandNames, setBrandNames] = useState([]);
    const [selectedBrandName, setSelectedBrandName] = useState(null);

    const [liquorQuantities, setLiquorQuantities] = useState([]);
    const [selectedLiquorQuantity, setSelectedLiquorQuantity] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(sessionStorage.getItem('user')); // Parse user from session storage

    useEffect(() => {
        const fetchBrandTypes = async () => {
            try {
                const data = await getBrandTypesForAvailableStocks(user.userId);
                setBrandTypes(data.map((type) => ({ value: type, label: type }))); // Format for react-select
                setLoading(false);
            } catch (error) {
                console.error('Error fetching brand types:', error);
                setLoading(false);
            }
        };
        fetchBrandTypes();
    }, [user.userId]);

    const handleBrandTypeChange = async (selectedOption) => {
        setSelectedBrandName(null);
        setSelectedLiquorQuantity(null);
        setLiquorQuantities([]);
        setSelectedBrandType(selectedOption);
        setSaleData((prevState) => ({
            ...prevState,
            brandType: selectedOption.value,
            brandName: '', // Reset brand name
            quantityId: '',
            quantity: 0,
            mrp: 0.0,
            dateOfSale: '',
            brandQuantityId: '',
        }))
        try {
            const response = await getBrandNamesForAvailableStocks(user.userId, selectedOption.value);
            setBrandNames(response); // Format for react-select
        } catch (error) {
            console.error('Error fetching brand names:', error);
        }

    }

    const handleBrandNameChange = async (selectedOption) => {
        setSelectedLiquorQuantity(null);
        setLiquorQuantities([]);
        setSelectedBrandName(selectedOption);
        setSaleData((prevState) => ({
            ...prevState,
            brandName: selectedOption.value,
            quantityId: '',
            quantity: 0,
            mrp: 0.0,
            dateOfSale: '',
            brandQuantityId: '',
        }));

        try {
            const quantity = await getQuantitiesForAvailableStocks(selectedBrandType.value, user.userId, selectedOption.value); // Fetch brand details
            console.log("Quantity Data", quantity);
            setLiquorQuantities(
                quantity.map((quantity) => ({
                    value: quantity.quantityId,
                    label: `${quantity.quantityName} - ${quantity.quantity} ml`,
                    mrp: quantity.price,
                    brandQuantityId: quantity.brandQuantityId,
                }))
            );
        } catch (error) {
            console.error("Error fetching brand details:", error);
        }
    };

    useEffect(() => {
        const { brandType, brandName, quantityId, quantity, mrp, dateOfSale } = saleData;
        setIsFormValid(brandType && brandName && quantityId && quantity > 0 && mrp > 0 && dateOfSale);
        console.log("Sale Data", saleData);
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
                quantityId: '',
                quantity: 0,
                mrp: 0.0,
                dateOfSale: '',
                brandQuantityId: '',
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
                {/* Brand Type */}
                <div className="form-group">
                    <label htmlFor="brandType">Brand Type</label>
                    {loading ? (
                        <p>Loading brand types...</p>
                    ) : (
                        <Select
                            id="brandType"
                            name="brandType"
                            options={brandTypes}
                            value={selectedBrandType}
                            onChange={handleBrandTypeChange}
                            placeholder="Select Brand Type"
                            isClearable
                        />
                    )}
                </div>

                {/* Brand Name */}
                <div className="form-group mt-3">
                    <label htmlFor="brandName">Brand Name</label>
                    <Select
                        id="brandName"
                        name="brandName"
                        options={brandNames}
                        value={selectedBrandName}
                        onChange={handleBrandNameChange}
                        placeholder="Select Brand Name"
                        isClearable
                        isDisabled={!saleData.brandType} // Disable until brand type is selected
                    />
                </div>

                {/* Liquor Quantity */}
                <div className="form-group mt-3">
                    <label htmlFor="liquorQuantity">Liquor Quantity</label>
                    <Select
                        options={liquorQuantities}
                        value={selectedLiquorQuantity}
                        onChange={(selectedOption) => {
                            setSelectedLiquorQuantity(selectedOption);
                            console.log("Selected liquor quantity ", selectedOption);
                            setSaleData((prevState) => ({
                                ...prevState,
                                quantityId: selectedOption.value,
                                mrp: selectedOption.mrp,
                                brandQuantityId: selectedOption.brandQuantityId,
                            }));
                            console.log("Sale data after quantity select", saleData);
                        }}
                        placeholder="Select or search Liquor Quantity"
                        isDisabled={!liquorQuantities.length}
                    />
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

                <button type="submit" className="btn btn-primary mt-3" disabled={!isFormValid}>
                    Add Sale
                </button>
            </form>
        </div>
    );
};

export default SalesForm;
