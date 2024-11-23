import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SaleList = ({ userId }) => {
    const [salesData, setSalesData] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [selectedFilter, setSelectedFilter] = useState("DAY");

    const fetchSalesData = () => {
        const requestData = {
            userId: 1,
            selectedDateRange: selectedFilter,
            startDate: dateRange[0] ? dateRange[0].toISOString() : null,
            endDate: dateRange[1] ? dateRange[1].toISOString() : null
        };

        axios.post("http://localhost:8080/api/sale/list", requestData)
            .then(response => {
                setSalesData(response.data);
            })
            .catch(error => {
                console.error("Error fetching sales data", error);
            });
    };

    const handleDateChange = (dates) => {
        setDateRange(dates);
    };

    return (
        <div className="container">
            <h2>Sales List</h2>

            {/* Filter Selection */}
            <div className="mb-3">
                <button className="btn btn-secondary" onClick={() => { setSelectedFilter('DAY'); fetchSalesData(); }}>Today</button>
                <button className="btn btn-secondary" onClick={() => { setSelectedFilter('WEEK'); fetchSalesData(); }}>Last Week</button>
                <button className="btn btn-secondary" onClick={() => { setSelectedFilter('MONTH'); fetchSalesData(); }}>Last Month</button>
                <button className="btn btn-secondary" onClick={() => { setSelectedFilter('CUSTOM'); }}>Custom Date Range</button>
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
                    <button className="btn btn-primary mt-3" onClick={fetchSalesData}>Fetch Sales</button>
                </div>
            )}

            {/* Sales Table */}
            <table className="table">
                <thead>
                <tr>
                    <th>Brand Type</th>
                    <th>Brand Name</th>
                    <th>Liquor Quantity</th>
                    <th>Quantity</th>
                    <th>MRP</th>
                    <th>Date of Sale</th>
                </tr>
                </thead>
                <tbody>
                {salesData.length > 0 ? salesData.map(sale => (
                    <tr key={sale.id}>
                        <td>{sale.brandType}</td>
                        <td>{sale.brandName}</td>
                        <td>{sale.liquorQuantity}</td>
                        <td>{sale.quantity}</td>
                        <td>{sale.mrp}</td>
                        <td>{new Date(sale.dateOfSale).toLocaleDateString()}</td>
                    </tr>
                )) : (
                    <tr><td colSpan="6">No sales data available</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default SaleList;