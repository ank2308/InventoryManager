import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // Import react-select
import {
    getBrandNamesForAvailableStocks,
    getBrandTypesForAvailableStocks,
    getQuantitiesForAvailableStocks
} from '../services/stocksApi';
import { addSale } from '../services/saleApi';
import {getBrandDetailsById} from "../services/brandApi";
import { fetchShopsByUserId } from '../services/shopsApi';

const SalesForm = () => {
    const [shops, setShops] = useState({});
    const [selectedShop, setSelectedShop] = useState(null); 
    const [user, setUser] = useState({});

    const [saleData, setSaleData] = useState({
        id: '',
        shopId: '',
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
    const [dateError, setDateError] = useState('');

    const validateDateOfSale = (dateOfSale) => {
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
        return dateOfSale <= today;
    };

    // fetch user from local storage
    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        setUser(storedUser);
    }, []);

    // fetch shops by userId
    useEffect(() => {
        const fetchShops = async (userId) => {
            try {
                const response = await fetchShopsByUserId(userId);
                const shopOptions = response.map((shop) => ({
                    value: shop.id,
                    label: `${shop.shopName}`,
                    licenseNo: shop.licenseNo,
                }), {});
                setShops(shopOptions);
                // Set the default selected shop to the first shop
                if (shopOptions.length > 0) {
                    setSelectedShop(shopOptions[0]);
                    setSaleData((prevState) => ({
                        ...prevState,
                        shopId: shopOptions[0]?.value,
                    }));
                }
            } catch (error) {
                console.error('Error fetching shops by userId:', error);
            }
        }
        if(user && user.userId) {
            fetchShops(user.userId)
        }
    }, [user])

    // fetch brand types by selected shop
    useEffect(() => {
        const fetchBrandTypes = async () => {
            try {
                const data = await getBrandTypesForAvailableStocks(selectedShop?.value);
                setBrandTypes(data.map((type) => ({ value: type, label: type }))); // Format for react-select
                setLoading(false);
            } catch (error) {
                console.error('Error fetching brand types:', error);
                setLoading(false);
            }
        };
        if (selectedShop && selectedShop?.value) {
            fetchBrandTypes();
        }
    }, [selectedShop]);


    useEffect(() => {
        const { brandType, brandName, quantityId, quantity, mrp, dateOfSale } = saleData;
        setIsFormValid(brandType && brandName && quantityId && quantity > 0 && mrp > 0 && dateOfSale);
    }, [saleData]);

    const handleShopChange = (selectedOption) => {
        setSelectedShop(selectedOption);
        setSaleData((prevState) => ({
            ...prevState,
            shopId: selectedOption.value,
        }));
    };

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
            const response = await getBrandNamesForAvailableStocks(selectedShop.value, selectedOption.value);
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
            const quantity = await getQuantitiesForAvailableStocks(selectedBrandType.value, selectedShop.value, selectedOption.value); // Fetch brand details
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "dateOfSale" && !validateDateOfSale(value)) {
            setDateError("Date of sale cannot be greater than today's date.");
            return;
        } else {
            setDateError('');
        }

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
            resetForm();
            
        } catch (error) {
            console.error('Error adding sale:', error);
            alert('Failed to add sale!');
        }
    };
    
    const resetForm = () => {
        setSelectedLiquorQuantity(null);
        setLiquorQuantities([]);
        setBrandNames([]);
        setSelectedBrandName(null);
        setBrandTypes([]);
        setSelectedBrandType(null)
        setSaleData({
            id: '',
            userId: '',
            shopId: '',
            brandType: '',
            brandName: '',
            quantityId: '',
            quantity: 0,
            mrp: 0.0,
            dateOfSale: '',
            brandQuantityId: '',
        });
    }

    return (
        <div className="container mt-5">
            <h2>Sales Form</h2>
            <form onSubmit={handleSubmit}>

                                {/* Shop Dropdown */}
                                <div className="form-group">
                    <label>Select Shop</label>
                    <Select
                        options={shops}
                        value={selectedShop}
                        onChange={handleShopChange}
                        placeholder="Select Shop"
                    />
                </div>

                {/* Display selected shop details */}
                {selectedShop && (
                    <div className="form-group mt-2">
                        <label>Shop Details:</label>
                        <p>
                            <strong>Shop Name:</strong> {selectedShop.label.split(' (')[0]} <br />
                            <strong>License No:</strong> {selectedShop.licenseNo} <br />
                            <strong>License Expiry:</strong> {selectedShop.licenseExpiry}
                        </p>
                    </div>
                )}

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
                    {dateError && <p style={{ color: 'red' }}>{dateError}</p>} {/* Display error if any */}
                </div>

                <button type="submit" className="btn btn-primary mt-3" disabled={!isFormValid}>
                    Add Sale
                </button>
            </form>
        </div>
    );
};

export default SalesForm;
