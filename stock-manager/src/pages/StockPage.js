// src/pages/StockPage.js
import React, { useState, useEffect } from 'react';
import StockForm from '../components/StockForm';
import StockList from '../components/StockList';
import { getStocks } from '../services/stocksApi';
import {Link} from "react-router-dom";

const StockPage = () => {
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        const fetchStocks = async () => {
            const data = await getStocks();
            setStocks(data);
        };
        fetchStocks();
    }, []);

    return (
        <div className="container mt-5">
            {/* Button to Add Stock positioned in the top-right corner */}
            <div className="d-flex justify-content-end mb-3">
                <Link to="/stock/add">
                    <button className="btn btn-primary">Add New Stock</button>
                </Link>
            </div>

            <div className="mt-4">
                <h4>Stock List</h4>
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                    <tr>
                        <th>#</th>
                        <th>Brand Name</th>
                        <th>Brand Type</th>
                        <th>Total Quantity</th>
                        <th>Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stocks.map((stock, index) => (
                        <tr key={stock.id}>
                            <td>{index + 1}</td>
                            <td>{stock.brandName}</td>
                            <td>{stock.brandType}</td>
                            <td>{stock.totalQuantity}</td>
                            <td>${stock.mrp}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockPage;
