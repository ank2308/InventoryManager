// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Stock Manager</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/stock">Stock Management</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/stock/add">Add Stock</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/sales">Sales Management</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/sales/add">Add Sale</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/user/add">Add User</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/brand/add">Add Brand</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
