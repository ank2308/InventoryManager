// src/components/StockList.js

import React, { useEffect, useState } from 'react';
import { fetchCurrentStockData } from '../services/stocksApi';
import StockForm from "./StockForm";

const CurrentStockList = () => {
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        const fetchStocks = async () => {
            const data = await fetchCurrentStockData(1);
            setStocks(data);
        };
        fetchStocks();
    }, []);

    return (
        <div className="container mt-5">
            <div className="mt-4">
                <h4>Stock List</h4>
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                    <tr>
                        <th>#</th>
                        <th>Brand</th>
                        <th>Type</th>
                        <th>Quantity Type</th>
                        <th>Size</th>
                        <th>Total Items Left</th>
                        <th>MRP</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stocks.map((stock, index) => (
                        <tr key={stock.id}>
                            <td>{index +1}</td>
                            <td>{stock.brandName}</td>
                            <td>{stock.brandType}</td>
                            <td>{stock.liquorQuantity}</td>
                            <td>{stock.liquorSize}</td>
                            <td>{stock.totalItemsLeft}</td>
                            <td>{stock.mrp}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default CurrentStockList;
