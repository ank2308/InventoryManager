// src/components/StockList.js

import React, { useEffect, useState } from 'react';
import { fetchCurrentStockData } from '../services/stocksApi';
import Select from 'react-select';
import { fetchShopsByUserId } from '../services/shopsApi';

const CurrentStockList = () => {
    const [stocks, setStocks] = useState([]);
    const [user, setUser] = useState({});
    const [shops, setShops] = useState({});
    const [selectedShop, setSelectedShop] = useState(null); 
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


    useEffect(() => {
        const fetchStocks = async () => {
            if(selectedShop && selectedShop?.value) {
                const data = await fetchCurrentStockData(selectedShop?.value);
                setStocks(data || []);
            }
        };
        if (!selectedShop) {
            setSelectedShopError("At least one shop should we selected");
            return;
        } else {
            setSelectedShopError('');
        }

        if(user) {
            fetchStocks();
        }
    }, [selectedShop]);

    const handleShopChange = (selectedOption) => {
        setSelectedShop(selectedOption);
    };


    return (
        <div className="container mt-5">
            <div className="mt-4">
                <h4>Stock List</h4>
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
