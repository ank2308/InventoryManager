// src/components/Navbar.js
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext); // Access user and logout from AuthContext
    const location = useLocation();

    // Define routes where the Navbar should be hidden
    const hideNavbarRoutes = ["/login"];
    if (hideNavbarRoutes.includes(location.pathname)) {
        return null;
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Stock Manager
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        {user && (
                            <>
                                {/* Common options for all users */}
                                <li className="nav-item">
                                    <Link className="nav-link" to="/stock">
                                        Stock Management
                                    </Link>
                                </li>
                                {/* Common options for all users */}
                                <li className="nav-item">
                                    <Link className="nav-link" to="/current-stock">
                                        Current Stock Details
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/sales">
                                        Sales Management
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/stock/add">
                                        Add Stock
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/sales/add">
                                        Add Sale
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/brand/list">
                                        Brands Details
                                    </Link>
                                </li>
                                {/* Admin-only options */}
                                {user.roles.includes("ROLE_ADMIN") && (
                                    <>

                                        <li className="nav-item">
                                            <Link className="nav-link" to="/user/add">
                                                Add User
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/brand/add">
                                                Add Brand
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/user/manage">
                                                Manage Users
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/appuser/add">
                                                Add Application User
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </>
                        )}
                    </ul>

                    {/* Right-side Logout */}
                    {user && (
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <span
                                    className="nav-link"
                                    style={{cursor: "pointer"}}
                                    onClick={logout}
                                >
                                    Logout
                                </span>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
