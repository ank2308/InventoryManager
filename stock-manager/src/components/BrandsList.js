import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

const BrandsList = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5); // Default items per page
    const [totalPages, setTotalPages] = useState(0);

    // Fetch brands based on current page and page size
    const fetchBrands = () => {
        setLoading(true);
        axiosInstance
            .get("http://localhost:8080/api/brands/getAllBrands", {
                params: {
                    page: currentPage - 1, // Backend pagination usually starts at 0
                    size: pageSize,
                },
            })
            .then((response) => {
                setBrands(response.data.content); // Assuming backend returns a paginated response
                setTotalPages(response.data.totalPages);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch brands");
                setLoading(false);
            });
    };

    // Fetch brands whenever `currentPage` or `pageSize` changes
    useEffect(() => {
        fetchBrands();
    }, [currentPage, pageSize]);

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setCurrentPage(1); // Reset to the first page
    };

    const handlePageChange = (direction) => {
        if (direction === "next" && currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container">
            <h2>Brand Management</h2>

            {/* Page Size Selector */}
            <div className="mb-3">
                <label htmlFor="pageSize" className="form-label">
                    Items per page:
                </label>
                <select
                    id="pageSize"
                    className="form-select"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>

            {/* Brands Table */}
            <table className="table">
                <thead>
                <tr>
                    <th>Brand Name</th>
                    <th>Brand Type</th>
                    <th>Description</th>
                    <th>MRP</th>
                    <th>Quantities</th>
                </tr>
                </thead>
                <tbody>
                {brands.length > 0 ? (
                    brands.map((brand) => (
                        <tr key={brand.id}>
                            <td>{brand.brandName}</td>
                            <td>{brand.brandType}</td>
                            <td>{brand.description}</td>
                            <td>{brand.mrp}</td>
                            <td>
                                {brand.quantities
                                    .map((q) => `${q.quantityName} (${q.quantity}ml)`)
                                    .join(", ")}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5">No brands available</td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                    className="btn btn-primary"
                    onClick={() => handlePageChange("prev")}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
          Page {currentPage} of {totalPages}
        </span>
                <button
                    className="btn btn-primary"
                    onClick={() => handlePageChange("next")}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default BrandsList;
