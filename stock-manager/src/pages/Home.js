// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container mt-5">
            <div className="text-center mt-4">
                <h2>Welcome to Stock Manager</h2>
                <p>Manage your stock and track sales efficiently.</p>
                <div className="mt-4">
                    <Link to="/stock">
                        <button className="btn btn-primary mr-3">Manage Stock</button>
                    </Link>
                    <Link to="/sales">
                        <button className="btn btn-success">Manage Sales</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
