import React, { useState } from 'react';
import logo from './logo.png';
import './App.css';

function formatGBP(value) {
  if (isNaN(value)) return "£0.00";
  return Number(value).toLocaleString("en-UK", { style: "currency", currency: "GBP" });
}

export default function App() {
  const [formData, setFormData] = useState({
    localSalesCount: '',
    foreignSalesCount: '',
    averageSaleAmount: ''
  });

  const [results, setResults] = useState({
    avalphaLocalCommission: 0,
    avalphaForeignCommission: 0,
    avalphaTotalCommission: 0,
    competitorLocalCommission: 0,
    competitorForeignCommission: 0,
    competitorTotalCommission: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Add extra validation for negative numbers
  const hasNegatives =
    Number(formData.localSalesCount) < 0 ||
    Number(formData.foreignSalesCount) < 0 ||
    Number(formData.averageSaleAmount) < 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasNegatives) {
      setError("Input values must be zero or positive.");
      return;
    }
    setIsLoading(true);
    setError("");
    setResults({
      avalphaLocalCommission: 0,
      avalphaForeignCommission: 0,
      avalphaTotalCommission: 0,
      competitorLocalCommission: 0,
      competitorForeignCommission: 0,
      competitorTotalCommission: 0
    });

    try {
      // Try backend API first
      const res = await fetch('https://localhost:5000/api/commission', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          localSalesCount: Number(formData.localSalesCount),
          foreignSalesCount: Number(formData.foreignSalesCount),
          averageSaleAmount: Number(formData.averageSaleAmount)
        })
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResults({
        avalphaLocalCommission: data.avalphaLocalCommission,
        avalphaForeignCommission: data.avalphaForeignCommission,
        avalphaTotalCommission: data.avalphaTotalCommission,
        competitorLocalCommission: data.competitorLocalCommission,
        competitorForeignCommission: data.competitorForeignCommission,
        competitorTotalCommission: data.competitorTotalCommission
      });
    } catch (err) {
      // Fallback local calculation, preserving UI & spec behavior
      const local = parseFloat(formData.localSalesCount) * parseFloat(formData.averageSaleAmount);
      const foreign = parseFloat(formData.foreignSalesCount) * parseFloat(formData.averageSaleAmount);

      const localCommission = isNaN(local) ? 0 : local * 0.20;
      const foreignCommission = isNaN(foreign) ? 0 : foreign * 0.35;
      const avalphaTotal = localCommission + foreignCommission;

      const competitorLocal = isNaN(local) ? 0 : local * 0.02;
      const competitorForeign = isNaN(foreign) ? 0 : foreign * 0.0755;
      const competitorTotal = competitorLocal + competitorForeign;

      setResults({
        avalphaLocalCommission: localCommission,
        avalphaForeignCommission: foreignCommission,
        avalphaTotalCommission: avalphaTotal,
        competitorLocalCommission: competitorLocal,
        competitorForeignCommission: competitorForeign,
        competitorTotalCommission: competitorTotal
      });

      setError("Backend not connected – showing locally calculated results.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <img src={logo} className="App-logo" alt="Avalpha Technologies Logo" />
          <h1 className="company-title">Avalpha Technologies</h1>
          <h2 className="app-subtitle">Commission Calculator</h2>
        </div>
      </header>

      <main className="main-content">
        <div className="calculator-container">
          <div className="form-section">
            <h3>Sales Information</h3>
            <form onSubmit={handleSubmit} className="calculator-form">
              <div className="form-group">
                <label htmlFor="localSalesCount">Local Sales Count</label>
                <input
                  type="number"
                  id="localSalesCount"
                  name="localSalesCount"
                  value={formData.localSalesCount}
                  onChange={handleInputChange}
                  placeholder="Enter number of local sales"
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="foreignSalesCount">Foreign Sales Count</label>
                <input
                  type="number"
                  id="foreignSalesCount"
                  name="foreignSalesCount"
                  value={formData.foreignSalesCount}
                  onChange={handleInputChange}
                  placeholder="Enter number of foreign sales"
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="averageSaleAmount">Average Sale Amount (£)</label>
                <input
                  type="number"
                  step="0.01"
                  id="averageSaleAmount"
                  name="averageSaleAmount"
                  value={formData.averageSaleAmount}
                  onChange={handleInputChange}
                  placeholder="Enter average sale amount"
                  required
                  min="0"
                />
              </div>

              <button
                type="submit"
                className={`calculate-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading || hasNegatives}
              >
                {isLoading ? 'Calculating...' : 'Calculate Commission'}
              </button>
            </form>
            {hasNegatives && (
              <div style={{ color: "red", marginTop: 10 }}>
                Negative numbers are not allowed.
              </div>
            )}
            {error && !hasNegatives && (
              <div style={{ color: "red", marginTop: 10 }}>{error}</div>
            )}
          </div>

          <div className="results-section">
            <h3>Commission Results</h3>
            <div className="results-grid">
              <div className="result-card avalpha-card">
                <div className="result-header">
                  <h4>Avalpha Technologies</h4>
                  <span className="commission-rates">Local: 20% | Foreign: 35%</span>
                </div>
                <div className="result-details">
                  <p>Local: {formatGBP(results.avalphaLocalCommission)}</p>
                  <p>Foreign: {formatGBP(results.avalphaForeignCommission)}</p>
                  <p><strong>Total: {formatGBP(results.avalphaTotalCommission)}</strong></p>
                </div>
              </div>

              <div className="result-card competitor-card">
                <div className="result-header">
                  <h4>Competitor</h4>
                  <span className="commission-rates">Local: 2% | Foreign: 7.55%</span>
                </div>
                <div className="result-details">
                  <p>Local: {formatGBP(results.competitorLocalCommission)}</p>
                  <p>Foreign: {formatGBP(results.competitorForeignCommission)}</p>
                  <p><strong>Total: {formatGBP(results.competitorTotalCommission)}</strong></p>
                </div>
              </div>
            </div>

            {results.avalphaTotalCommission > 0 && (
              <div className="advantage-indicator">
                <p className="advantage-text">
                  Avalpha Technologies advantage:
                  <strong> {formatGBP(results.avalphaTotalCommission - results.competitorTotalCommission)}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="App-footer">
        <p>&copy; 2025 Avalpha Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
