// src/pages/StockPage.js
import React, { useState, useEffect } from 'react';
import { fetchStockData } from '../services/stocksApi';
import DatePicker from "react-datepicker";
import StockList from "../components/StockList";

const StockPage = () => {

    return (
        <StockList />
    );
};

export default StockPage;
