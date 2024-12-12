// src/components/StockList.js

import React, { useEffect, useState } from 'react';
import { fetchStockData } from '../services/stocksApi';
import StockForm from "./StockForm";

const StockList = () => {
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        const fetchStocks = async () => {
            const data = await fetchStockData();
            setStocks(data);
        };
        fetchStocks();
    }, []);

    return (
        <div className="container mt-5">
            <h2>Stock Management</h2>
            <StockForm />
            <div className="mt-4">
                <h4>Stock List</h4>
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                    <tr>
                        <th>#</th>
                        <th>Brand</th>
                        <th>Type</th>
                        <th>Liquor Quantity(ml)</th>
                        <th>Total Quantity Left</th>
                        <th>Total Liquor Quantity Left(ml)</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stocks.map((stock, index) => (
                        <tr key={stock.id}>
                            <td>{index +1}</td>
                            <td>{stock.brandName}</td>
                            <td>{stock.brandType}</td>
                            <td>{stock.liquorQuantity}</td>
                            <td>{stock.totalCrateLotQuantityLeft}</td>
                            <td>{stock.totalLiquorQuantityLeft}</td>
                        <td>
                            <button>Edit</button>
                            <button>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default StockList;
