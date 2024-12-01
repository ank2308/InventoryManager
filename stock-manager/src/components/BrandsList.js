import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

const BrandsList = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25); // Default items per page
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [suggestions, setSuggestions] = useState([]);


    // Fetch brands based on current page and page size
    const fetchBrands = () => {
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

    // Fetch suggestions for the input
    const fetchSuggestions = async (query) => {
        if (!query.trim()) {
            console.log("setting dearch as emoty");
            setSuggestions([]); // Clear suggestions if query is empty
            return;
        }
        try {
            const response = await axiosInstance.get(
                `/api/brands/suggestions?query=${query}`
            );
            setSuggestions(response.data);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion); // Set the search term to the clicked suggestion
        setSuggestions([]); // Clear suggestions
        searchBrands(suggestion); // Perform the search
    };

    // Handle search input change with debounce
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Clear previous timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Set new timeout
        setTypingTimeout(
            setTimeout(() => {
                if (value.trim() === "") {
                    fetchBrands();
                    fetchSuggestions("")// Fetch all brands if search is empty
                } else {
                    fetchSuggestions(value); // Search brands
                }
            }, 500) // Wait 5 seconds
        );
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            searchBrands(searchTerm); // Trigger search on Enter key
            setSuggestions([]); // Clear suggestions
        }
    };

    // Search brands by name
    const searchBrands = async () => {
        if (!searchTerm.trim()) {
            fetchBrands(); // If search is empty, fetch all brands
            return;
        }
        try {
            const response = await axiosInstance.get(
                `/api/brands/search?brandName=${searchTerm}`
            );
            setBrands(response.data);
        } catch (error) {
            console.error("Error searching brands:", error);
        }
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

            {/* Search Input */}
            <div className="mb-3 position-relative">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Brand Name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown} // Trigger search on Enter key
                />

                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                    <ul className="list-group position-absolute" style={{ zIndex: 1000 }}>
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className="list-group-item"
                                onClick={() => handleSuggestionClick(suggestion)}
                                style={{ cursor: "pointer" }}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

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
