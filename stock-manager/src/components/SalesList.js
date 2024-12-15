import React, {useEffect, useState} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {getQuantity, getSales} from "../services/saleApi";
import Select from 'react-select';
import { fetchShopsByUserId } from '../services/shopsApi';

const SaleList = ({ userId }) => {
    const [shops, setShops] = useState({});
    const [selectedShop, setSelectedShop] = useState(null); 
    const [user, setUser] = useState({});
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
        const fetchSalesData = async () => {
            const requestData = {
                userId: user.userId,
                shopId: selectedShop?.value || shops[0]?.id,
                selectedDateRange: selectedFilter,
                startDate: dateRange[0] ? dateRange[0].toISOString() : null,
                endDate: dateRange[1] ? dateRange[1].toISOString() : null
            };

            const response = await getSales(requestData);
            if(response && response.length > 0) {
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
        if (!selectedShop) {
            setSelectedShopError("At least one shop should we selected");
            return;
        } else {
            setSelectedShopError('');
        }

        if (selectedShop && selectedShop?.value){
            fetchSalesData()
        }
    }, [selectedShop, shops, selectedFilter, dateRange])

    const handleDateChange = (dates) => {
        setDateRange(dates);
    };

    const handleShopChange = (selectedOption) => {
        setSelectedShop(selectedOption);
        setSalesData((prevState) => ({
            ...prevState,
            shopId: selectedOption.value,
        }));
    };

    return (
        <div className="container">
            <h2>Sales List</h2>

            {/* Filter Selection */}
            <div className="mb-3 d-flex">
                <button
                    className={`btn btn-outline-secondary ${selectedFilter === 'DAY' ? 'active' : ''} mx-2`}
                    onClick={() => { setSelectedFilter('DAY'); }}
                >
                    Today
                </button>
                <button
                    className={`btn btn-outline-secondary ${selectedFilter === 'WEEK' ? 'active' : ''} mx-2`}
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

            {/* Sales Table */}
            <table className="table table-bordered table-striped">
                <thead>
                <tr>
                    <th>Brand Type</th>
                    <th>Brand Name</th>
                    <th>Liquor Quantity Sold</th>
                    <th>Quantity Size</th>
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