// src/pages/StockPage.js
import React, { useState, useEffect } from 'react';
import StockForm from '../components/StockForm';
import StockList from '../components/StockList';
import { getStocks } from '../services/stocksApi';
import {Link} from "react-router-dom";
import {getQuantity} from "../services/saleApi";
import DatePicker from "react-datepicker";

const user = JSON.parse(sessionStorage.getItem('user'));

const StockPage = () => {
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
        console.log("userId", user);
        const fetchStocks = async () => {
            const requestData = {
                userId: user.userId,
                selectedDateRange: selectedFilter,
                startDate: dateRange[0] ? dateRange[0].toISOString() : null,
                endDate: dateRange[1] ? dateRange[1].toISOString() : null
            };

            const data = await getStocks(requestData);
            setStocks(data);
        };
        fetchStocks();
    }, []);

    const fetchStockData = async () => {
        const requestData = {
            userId: user.userId,
            selectedDateRange: selectedFilter,
            startDate: dateRange[0] ? dateRange[0].toISOString() : null,
            endDate: dateRange[1] ? dateRange[1].toISOString() : null
        };

        const response = await getStocks(requestData);
        console.log("Stocks Data", response);
        if(response.length > 0) {
            const updatedSalesData = await Promise.all(
                response.map(async (stock) => {
                    return {
                        userId: stock.id,
                        warehouseNumber: stock.warehouseNumber,
                        brandName: stock.brandName,
                        brandType: stock.brandType,
                        quantity: stock.liquorQuantity,
                        totalItemsLeft: stock.totalItemsLeft,
                        totalLiquorQuantityLeft: stock.totalLiquorQuantityLeft,
                        totalPrice: stock.totalPrice,
                    };
                })
            );
            setStocks(updatedSalesData);
        } else {
            setStocks([]);
        }
    };

    const handleDateChange = (dates) => {
        setDateRange(dates);
    };

    return (
        <div className="container mt-5">
            {/* Button to Add Stock positioned in the top-right corner */}
            {/*<div className="d-flex justify-content-end mb-3">*/}
            {/*    <Link to="/stock/add">*/}
            {/*        <button className="btn btn-primary">Add New Stock</button>*/}
            {/*    </Link>*/}
            {/*</div>*/}

            <div className="mb-3">
                <button className="btn btn-secondary" onClick={() => {
                    setSelectedFilter('DAY');
                    fetchStockData();
                }}>Today
                </button>
                <button className="btn btn-secondary" onClick={() => {
                    setSelectedFilter('WEEK');
                    fetchStockData();
                }}>Last Week
                </button>
                <button className="btn btn-secondary" onClick={() => {
                    setSelectedFilter('MONTH');
                    fetchStockData();
                }}>Last Month
                </button>
                <button className="btn btn-secondary" onClick={() => {
                    setSelectedFilter('CUSTOM');
                }}>Custom Date Range
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
                    <button className="btn btn-primary mt-3" onClick={fetchStockData}>Fetch Stock</button>
                </div>
            )}

            <div className="mt-4">
                <h4>Stock Details</h4>
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
                        <tr key={stock.id}>
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
        </div>
    );
};

export default StockPage;
