import React, { useState, useEffect } from "react";
import api from "../../api";
import "../ADMIN/styles/viewContracts.css";

const ViewContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        // Match exactly with your backend route
        const response = await api.get("/players/get-allcontracts");
        
        // Your backend returns either the data array or empty array
        setContracts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Contract fetch error:", {
          message: err.message,
          response: err.response?.data
        });
        setError(err.response?.data?.error || "Failed to fetch contracts");
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

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
    <div className="contracts-container">
      <h1>Player Contracts</h1>
      <div className="table-container">
        <table className="contracts-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Contract Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Monthly Stipend</th>
              <th>Performance Bonus</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
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
              </tr>
            ))}
          </tbody>
        </table>
        {contracts.length === 0 && (
          <div className="no-results">No contracts found</div>
        )}
      </div>
    </div>
  );
};

export default ViewContracts;