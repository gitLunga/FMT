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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editContractData, setEditContractData] = useState(null);

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

  const handleEditContract = (contractId) => {
    const contract = contracts.find(c => c.contract_id === contractId);
    setEditContractData(contract);
    setIsEditModalOpen(true);
  };

  const handleDeleteContract = async (contractId) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      try {
        await api.delete(`/players/contracts/${contractId}`);
        setContracts(contracts.filter(contract => contract.contract_id !== contractId));
        alert('Contract deleted successfully');
      } catch (err) {
        setError('Failed to delete contract');
        console.error(err);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`players/contracts/${editContractData.contract_id}`, editContractData);
      setContracts(prevContracts =>
        prevContracts.map(c =>
          c.contract_id === editContractData.contract_id ? editContractData : c
        )
      );
      setIsEditModalOpen(false);
      alert('Contract updated successfully');
    } catch (err) {
      setError('Failed to update contract');
      console.error(err);
    }
  };

  const filterAndSortContracts = useCallback(() => {
    let result = [...contracts];

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

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditContractData(prev => ({ ...prev, [name]: value }));
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
              <th>Actions</th>
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
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditContract(contract.contract_id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteContract(contract.contract_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">No contracts found matching your criteria</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="summary">
        Showing {filteredContracts.length} of {contracts.length} contracts
      </div>

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Contract</h2>
            
            <div className="modal-form-group">
              <label>Contract Type:</label>
              <select
                name="contract_type"
                value={editContractData?.contract_type || ''}
                onChange={handleEditInputChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Trial">Trial</option>
              </select>
            </div>
            
            <div className="modal-form-group">
              <label>Start Date:</label>
              <input 
                type="date"
                name="start_date"
                value={editContractData?.start_date?.slice(0, 10) || ''}
                onChange={handleEditInputChange}
              />
            </div>
            
            <div className="modal-form-group">
              <label>End Date:</label>
              <input 
                type="date"
                name="end_date"
                value={editContractData?.end_date?.slice(0, 10) || ''}
                onChange={handleEditInputChange}
              />
            </div>
            
            <div className="modal-form-group">
              <label>Monthly Stipend (ZAR):</label>
              <input 
                type="number"
                name="monthly_stipend"
                min="0"
                step="1000"
                value={editContractData?.monthly_stipend || ''}
                onChange={handleEditInputChange}
              />
            </div>
            
            <div className="modal-form-group">
              <label>Performance Bonus (ZAR):</label>
              <input 
                type="number"
                name="performance_bonus"
                min="0"
                step="1000"
                value={editContractData?.performance_bonus || ''}
                onChange={handleEditInputChange}
              />
            </div>
            
            <div className="modal-form-group">
              <label>Status:</label>
              <select
                name="status"
                value={editContractData?.status || ''}
                onChange={handleEditInputChange}
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
            
            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSaveEdit}>Save</button>
              <button className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewContracts;