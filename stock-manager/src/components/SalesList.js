import React, {useEffect, useState} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {getQuantity, getSales} from "../services/saleApi";

const SaleList = ({ userId }) => {
    const [saleData, setSaleData] = useState({
        userId: '',
        brandName: '',
        brandType: '',
        quantity: '',
        itemsSold: 0,
        mrp: 0.0,
        dateOfSale: '',
    });
    const [salesData, setSalesData] = useState([saleData]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [selectedFilter, setSelectedFilter] = useState("DAY");

    useEffect(() => {
        const fetchSales = async () => {
            const requestData = {
                userId: 1,
                selectedDateRange: selectedFilter,
                startDate: dateRange[0] ? dateRange[0].toISOString() : null,
                endDate: dateRange[1] ? dateRange[1].toISOString() : null
            };
            const response = await getSales(requestData);
            if(response.length > 0) {
                const updatedSalesData = await Promise.all(
                    response.map(async (sale) => {
                        const quantity = await getQuantity(sale.quantityId);
                        return {
                            userId: sale.userId,
                            brandName: sale.brandName,
                            brandType: sale.brandType,
                            quantity: quantity,
                            itemsSold: sale.itemsSold,
                            mrp: sale.mrp,
                            dateOfSale: sale.dateOfSale,
                        };
                    })
                );
                setSalesData(updatedSalesData);

            } else {
                setSalesData([]);
            }
        }
        fetchSales();
    }, []);

    const fetchSalesData = async () => {
        const requestData = {
            userId: 1,
            selectedDateRange: selectedFilter,
            startDate: dateRange[0] ? dateRange[0].toISOString() : null,
            endDate: dateRange[1] ? dateRange[1].toISOString() : null
        };

        const response = await getSales(requestData);
        console.log("Sales Data", response);
        if(response.length > 0) {
            const updatedSalesData = await Promise.all(
                response.map(async (sale) => {
                    const quantity = await getQuantity(sale.quantityId);
                    return {
                        userId: sale.id,
                        brandName: sale.brandName,
                        brandType: sale.brandType,
                        quantity: quantity,
                        itemsSold: sale.itemsSold,
                        mrp: sale.mrp,
                        dateOfSale: sale.dateOfSale,
                    };
                })
            );
            setSalesData(updatedSalesData);
        } else {
            setSalesData([]);
        }
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
                        <td>{sale.itemsSold}</td>
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