// src/pages/StockPage.js
import React, { useState, useEffect } from 'react';
import { fetchStockData } from '../services/stocksApi';
import DatePicker from "react-datepicker";
import { fetchShopsByUserId } from '../services/shopsApi';
import Select from 'react-select';


const StockList = () => {
    const [shops, setShops] = useState({});
    const [selectedShop, setSelectedShop] = useState(null); 
    const [user, setUser] = useState({});
    const [stockData, setStockData] = useState({
        warehouseNumber: "",
        brandName: '',
        brandType: '',
        liquorQuantity: '',
        totalItemsLeft:0,
        totalLiquorQuantityLeft:0,
        totalPrice: 0.0,
    });
    const [stocks, setStocks] = useState([stockData]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [selectedFilter, setSelectedFilter] = useState("DAY");
    const [selectedShopError, setSelectedShopError] = useState('')

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        setUser(storedUser);
    }, []);

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
                }
            } catch (error) {
                console.error('Error fetching shops by userId:', error);
            }
        }
        if(user && user.userId) {
            fetchShops(user.userId)
        }
    }, [user])

    
    useEffect(()=>{
        // Shared function to fetch stocks
        const fetchStocksData = async () => {
            const requestData = {
                userId: user?.userId,
                shopId: selectedShop?.value || shops[0]?.id,
                selectedDateRange: selectedFilter,
                startDate: dateRange[0] ? dateRange[0].toISOString() : null,
                endDate: dateRange[1] ? dateRange[1].toISOString() : null,
            };

            try {
                const response = await fetchStockData(requestData);
                if (response.length > 0) {
                    const updatedStocks = response.map((stock) => ({
                        userId: stock.id,
                        warehouseNumber: stock.warehouseNumber,
                        brandName: stock.brandName,
                        brandType: stock.brandType,
                        quantity: stock.liquorQuantity,
                        totalItemsLeft: stock.totalItemsLeft,
                        totalLiquorQuantityLeft: stock.totalLiquorQuantityLeft,
                        totalPrice: stock.totalPrice,
                    }));
                    setStocks(updatedStocks);
                } else {
                    setStocks([]);
                }
            } catch (error) {
                console.error('Error fetching stocks:', error);
                setStocks([]);
            }
        };

        if (!selectedShop) {
            setSelectedShopError("At least one shop should we selected");
            return;
        } else {
            setSelectedShopError('');
        }

        if (selectedShop && selectedShop?.value){
            fetchStocksData()
        }
    }, [selectedShop, shops, selectedFilter, dateRange])

    const handleDateChange = (dates) => {
        setDateRange(dates);
    };

    const handleShopChange = (selectedOption) => {
        setSelectedShop(selectedOption);
        setStockData((prevState) => ({
            ...prevState,
            shopId: selectedOption.value,
        }));
    };

    return (
        <div className="container">
            <h4>Stock Details</h4>

            {/* Filter Selection */}
            <div className="mb-3 d-flex">
                <button
                    className={`btn btn-outline-secondary ${selectedFilter === 'DAY' ? 'active' : ''} mx-2`}
                    onClick={() => { setSelectedFilter('DAY'); }}
                >
                    Today
                </button>
                <button
                    className={`btn btn-outline-secondary ${selectedFilter === 'WEEK' ? 'active' : ''}mx-2`}
                    onClick={() => { setSelectedFilter('WEEK'); }}
                >
                    Last Week
                </button>
                <button
                    className={`btn btn-outline-secondary ${selectedFilter === 'MONTH' ? 'active' : ''}mx-2`}
                    onClick={() => { setSelectedFilter('MONTH'); }}
                >
                    Last Month
                </button>
                <button
                    className={`btn btn-outline-secondary ${selectedFilter === 'CUSTOM' ? 'active' : ''}mx-2`}
                    onClick={() => { setSelectedFilter('CUSTOM'); }}
                >
                    Custom Date Range
                </button>
            </div>

            {/* Date Range Picker for Custom */}
            {selectedFilter === 'CUSTOM' && (
                <div className="mb-3">
                    <DatePicker
                        selected={dateRange[0]}
                        onChange={handleDateChange}
                        startDate={dateRange[0]}
                        endDate={dateRange[1]}
                        selectsRange
                        inline
                    />
                </div>
            )}

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
                    </p>
                </div>
            )}
            {selectedShopError && <p style={{ color: 'red' }}>{selectedShopError}</p>} {/* Display error if any */}


            <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                <tr>
                    <th>Warehouse Number</th>
                    <th>Brand Name</th>
                    <th>Brand Type</th>
                    <th>Total Quantity</th>
                    <th>Amount</th>
                </tr>
                </thead>
                <tbody>
                {stocks.length >0 ? stocks.map((stock, index) => (
                    <tr key={index}>
                        <td>{stock.warehouseNumber}</td>
                        <td>{stock.brandName}</td>
                        <td>{stock.brandType}</td>
                        <td>{stock.totalItemsLeft}</td>
                        <td>Rs. {stock.totalPrice}</td>
                    </tr>
                )) : (
                    <tr><td colSpan="7">No stock data available</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default StockList;
