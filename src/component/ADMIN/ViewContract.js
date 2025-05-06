import React, { useState, useEffect, useCallback } from "react";
import api from "../../api";
import "../ADMIN/styles/viewContracts.css";

const ViewContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    minAmount: ""
  });
  const [sortConfig, setSortConfig] = useState({
    key: "end_date",
    direction: "desc"
  });

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await api.get("/players/contracts");
      setContracts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const filterAndSortContracts = useCallback(() => {
    let result = [...contracts];

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(c =>
        c.first_name?.toLowerCase().includes(searchTerm) ||
        c.last_name?.toLowerCase().includes(searchTerm) ||
        c.contract_type?.toLowerCase().includes(searchTerm))
    }

    if (filters.status) {
      result = result.filter(c => c.status?.toLowerCase() === filters.status.toLowerCase());
    }

    if (filters.dateFrom) {
      result = result.filter(c => new Date(c.start_date) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      result = result.filter(c => new Date(c.end_date) <= new Date(filters.dateTo));
    }

    if (filters.minAmount) {
      result = result.filter(c => c.monthly_stipend >= Number(filters.minAmount));
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredContracts(result);
  }, [contracts, filters, sortConfig]);

  useEffect(() => {
    filterAndSortContracts();
  }, [filterAndSortContracts]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const formatCurrency = (amount) => {
    return amount ?
      new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount)
      : "-";
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString("en-ZA") : "-";
  };

  if (loading) return <div className="loading">Loading contracts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="table-view-container">
      <h1>Player Contracts</h1>

      <div className="filters-container">
        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search contracts..."
          />
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>

        <div className="filter-group">
          <label>From Date:</label>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>To Date:</label>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>Min Amount:</label>
          <input
            type="number"
            name="minAmount"
            value={filters.minAmount}
            onChange={handleFilterChange}
            placeholder="Min stipend"
            min="0"
          />
        </div>

        <button
          className="reset-filters"
          onClick={() => setFilters({
            search: "",
            status: "",
            dateFrom: "",
            dateTo: "",
            minAmount: ""
          })}
        >
          Reset Filters
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('last_name')}>
                Player {getSortIndicator('last_name')}
              </th>
              <th onClick={() => handleSort('contract_type')}>
                Type {getSortIndicator('contract_type')}
              </th>
              <th onClick={() => handleSort('start_date')}>
                Start Date {getSortIndicator('start_date')}
              </th>
              <th onClick={() => handleSort('end_date')}>
                End Date {getSortIndicator('end_date')}
              </th>
              <th onClick={() => handleSort('monthly_stipend')}>
                Stipend {getSortIndicator('monthly_stipend')}
              </th>
              <th onClick={() => handleSort('performance_bonus')}>
                Bonus {getSortIndicator('performance_bonus')}
              </th>
              <th onClick={() => handleSort('status')}>
                Status {getSortIndicator('status')}
              </th>
              <th >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredContracts.length > 0 ? (
              filteredContracts.map(contract => (
                <tr key={contract.contract_id}>
                  <td>{contract.first_name} {contract.last_name}</td>
                  <td>{contract.contract_type || "-"}</td>
                  <td>{formatDate(contract.start_date)}</td>
                  <td>{formatDate(contract.end_date)}</td>
                  <td>{formatCurrency(contract.monthly_stipend)}</td>
                  <td>{formatCurrency(contract.performance_bonus)}</td>
                  <td>
                    <span className={`status-badge ${contract.status?.toLowerCase()}`}>
                      {contract.status || "-"}
                    </span>
                  </td>
                  <td className="actions-column">
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">No contracts found matching your criteria</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="summary">
        Showing {filteredContracts.length} of {contracts.length} contracts
      </div>
    </div>
  );
};

export default ViewContracts;