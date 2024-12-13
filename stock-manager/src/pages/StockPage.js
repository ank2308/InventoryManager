// src/pages/StockPage.js
import React, { useState, useEffect } from 'react';
import { fetchStockData } from '../services/stocksApi';
import DatePicker from "react-datepicker";

const StockPage = () => {
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

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        setUser(storedUser);
    }, []);

    // Fetch stock data on page load and state changes
    useEffect(() => {
        if (user && selectedFilter !== 'CUSTOM') {
            fetchStocksData(selectedFilter, dateRange);
        }
    }, [user, selectedFilter, dateRange]);

    // Shared function to fetch stocks
    const fetchStocksData = async (filter, range) => {
        const requestData = {
            userId: user?.userId,
            selectedDateRange: filter,
            startDate: range[0] ? range[0].toISOString() : null,
            endDate: range[1] ? range[1].toISOString() : null,
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

    // Trigger fetch for custom date range
    const fetchCustomStockData = () => {
        if (selectedFilter === 'CUSTOM') {
            fetchStockData('CUSTOM', dateRange);
        }
    };

    const handleFilterClick = (filter) => {
        setSelectedFilter(filter);
        if (filter !== 'CUSTOM') {
            setDateRange([null, null]); // Reset custom date range for non-custom filters
        }
    };

    const handleDateChange = (dates) => {
        setDateRange(dates);
    };

    return (
        <div className="container">
            <h4>Stock Details</h4>

            <div className="mb-3">
                <button
                    className="btn btn-secondary"
                    onClick={() => handleFilterClick('DAY')}
                >
                    Today
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => handleFilterClick('WEEK')}
                >
                    Last Week
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => handleFilterClick('MONTH')}
                >
                    Last Month
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => handleFilterClick('CUSTOM')}
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
                    <button className="btn btn-primary mt-3" onClick={fetchCustomStockData}>
                        Fetch Stock
                    </button>
                </div>
            )}

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
                {stocks.map((stock, index) => (
                    <tr key={index}>
                        <td>{stock.warehouseNumber}</td>
                        <td>{stock.brandName}</td>
                        <td>{stock.brandType}</td>
                        <td>{stock.totalItemsLeft}</td>
                        <td>Rs. {stock.totalPrice}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default StockPage;
