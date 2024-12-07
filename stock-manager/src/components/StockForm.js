// src/components/StockForm.js
import React, {useContext, useEffect, useState} from 'react';
import { addStock, getBrandTypesForAvailableStocks } from '../services/stocksApi';
import { getBrandTypes, getBrandNamesByType, getBrandDetailsById } from '../services/brandApi';
import Select from 'react-select';
import AuthContext from "../context/AuthContext";

const StockForm = () => {
    const [brandTypes, setBrandTypes] = useState([]);
    const [selectedBrandType, setSelectedBrandType] = useState(null);

    const [brandNames, setBrandNames] = useState([]);
    const [selectedBrandName, setSelectedBrandName] = useState(null);

    const [liquorQuantities, setLiquorQuantities] = useState([]);
    const [selectedLiquorQuantity, setSelectedLiquorQuantity] = useState(null);

    const {user} = useContext(AuthContext);

    const [stockData, setStockData] = useState({
        userId: "",
        brandName: '',
        brandType: '',
        lotSize: 0,
        crateInLot: 0,
        itemsInCrate: 0,
        quantityId: '',
        brandQuantityId:'',
        mrp: 0.0,
        marginPrice: 0.0,
        dateOfMgf: '',
    });



    const [isFormValid, setIsFormValid] = useState(false);

    // Fetch brand types on component mount
    useEffect(() => {
        const fetchBrandTypes = async () => {
            try {
                const response = await getBrandTypes();
                setBrandTypes(response.data.map((type) => ({ value: type, label: type })));
            } catch (error) {
                console.error('Error fetching brand types:', error);
            }
        };
        fetchBrandTypes();
    }, []);

    // Fetch brand names when a brand type is selected
    const handleBrandTypeChange = async (selectedOption) => {
        setSelectedBrandName(null);
        setSelectedLiquorQuantity(null);
        setLiquorQuantities([]);
        setSelectedBrandType(selectedOption);
        setStockData((prevState) => ({
            ...prevState,
            brandType: selectedOption.value,
            brandName: '', // Reset brand name
            quantityId: '',
            mrp: 0.0, // Reset MRP
        }));

        try {
            const response = await getBrandNamesByType(selectedOption.value);
            console.log(response);
            setBrandNames(response);
        } catch (error) {
            console.error('Error fetching brand names:', error);
        }
    };

    const handleBrandNameChange = async (selectedOption) => {
        setSelectedLiquorQuantity(null);
        setLiquorQuantities([]);
        setSelectedBrandName(selectedOption);
        setStockData((prevState) => ({
            ...prevState,
            brandName: selectedOption.label,
            quantityId: '',
            mrp: 0.0, // Reset MRP
        }));

        try {
            const brandDetails = await getBrandDetailsById(selectedOption.value); // Fetch brand details
            console.log("Selected brand Details", brandDetails);
            setLiquorQuantities(
                brandDetails.quantityMappings.map((quantity) => ({
                    value: quantity.quantityId,
                    label: `${quantity.quantityName} - ${quantity.quantity} ml`,
                    mrp: quantity.mrp, // Include MRP for dynamic updates
                    quantityBrandId: quantity.brandQuantityId,
                }))
            );
        } catch (error) {
            console.error("Error fetching brand details:", error);
        }
    };

    // Validate the form
    useEffect(() => {
        const { brandType, brandName, lotSize, crateInLot, itemsInCrate, quantityId, mrp, dateOfMgf } = stockData;
        setIsFormValid(brandType && brandName && lotSize && itemsInCrate && crateInLot && quantityId && mrp && dateOfMgf);
    }, [stockData]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("UserId ", user)
        try {
            console.log("StockData", stockData);
            await addStock({ ...stockData, userId: user.userId });
            alert('Stock added successfully!');
            setStockData({
                brandName: '',
                brandType: '',
                lotSize: 0,
                crateInLot: 0,
                itemsInCrate: 0,
                quantityId: '',
                brandQuantityId:'',
                mrp: 0.0,
                marginPrice: 0.0,
                dateOfMgf: '',
            });
            setSelectedBrandType(null);
            setSelectedBrandName(null);
            setSelectedLiquorQuantity(null);
        } catch (error) {
            console.error('Error adding stock:', error);
            alert('Failed to add stock.');
        }
    };

    return (
        <div className="card p-4">
            <h5>Add New Stock</h5>
            <form onSubmit={handleSubmit}>
                {/* Brand Type Dropdown */}
                <div className="form-group">
                    <label>Brand Type</label>
                    <Select
                        options={brandTypes}
                        value={selectedBrandType}
                        onChange={handleBrandTypeChange}
                        placeholder="Select or search Brand Type"
                    />
                </div>

                {/* Brand Name Dropdown */}
                <div className="form-group mt-3">
                    <label>Brand Name</label>
                    <Select
                        options={brandNames}
                        value={selectedBrandName}
                        onChange={handleBrandNameChange}
                        placeholder="Select or search Brand Name"
                        isDisabled={!brandNames.length}
                    />
                </div>

                {/* Liquor Quantity Dropdown */}
                <div className="form-group mt-3">
                    <label>Liquor Quantity</label>
                    <Select
                        options={liquorQuantities}
                        value={selectedLiquorQuantity}
                        onChange={(selectedOption) => {
                            setSelectedLiquorQuantity(selectedOption);
                            console.log("Selected liquor quantity ", selectedOption);
                            setStockData((prevState) => ({
                                ...prevState,
                                quantityId: selectedOption.value,
                                brandQuantityId: selectedOption.quantityBrandId,
                                mrp: selectedOption.mrp, // Dynamically update MRP
                            }));
                        }}
                        placeholder="Select or search Liquor Quantity"
                        isDisabled={!liquorQuantities.length}
                    />
                </div>

                {/* Additional Fields */}
                <div className="form-group mt-3">
                    <label>Price (MRP)</label>
                    <input type="number" className="form-control" name="mrp" value={stockData.mrp} readOnly/>
                </div>

                <div className="form-group mt-3">
                    <label>Items in Crate</label>
                    <input
                        type="number"
                        className="form-control"
                        name="itemsInCrate"
                        value={stockData.itemsInCrate}
                        onChange={(e) => setStockData({...stockData, itemsInCrate: e.target.value})}
                    />
                </div>

                <div className="form-group mt-3">
                    <label>Crate in Lots</label>
                    <input
                        type="number"
                        className="form-control"
                        name="crateInLot"
                        value={stockData.crateInLot}
                        onChange={(e) => setStockData({...stockData, crateInLot: e.target.value})}
                    />
                </div>

                <div className="form-group mt-3">
                    <label>No of Lots</label>
                    <input
                        type="number"
                        className="form-control"
                        name="lotSize"
                        value={stockData.lotSize}
                        onChange={(e) => setStockData({...stockData, lotSize: e.target.value})}
                    />
                </div>

                <div className="form-group mt-3">
                    <label>Margin Price</label>
                    <input
                        type="number"
                        className="form-control"
                        name="marginPrice"
                        value={stockData.marginPrice}
                        onChange={(e) => setStockData({...stockData, marginPrice: e.target.value})}
                    />
                </div>

                <div className="form-group mt-3">
                    <label>Date of Manufacture</label>
                    <input
                        type="date"
                        className="form-control"
                        name="dateOfMgf"
                        value={stockData.dateOfMgf}
                        onChange={(e) => setStockData({...stockData, dateOfMgf: e.target.value})}
                    />
                </div>

                <button type="submit" className="btn btn-primary mt-3" disabled={!isFormValid}>
                    Add Stock
                </button>
            </form>
        </div>
    );
};

export default StockForm;
