import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Import to ensure Chart.js components are auto-registered

const PredictPotatoDemand = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      if (predictions && predictions.length > 0) {
        console.log('Setting up chart data with predictions:', predictions);
        
        const chartLabels = predictions.map(prediction => prediction.date);
        const dataSets = ["POTATOES", "POTATOES PREMIUM", "ORGANIC POTATO", "BABY POTATOES"].map(category => ({
          label: category,
          data: predictions.map(prediction => {
            const value = prediction.predictions[category];
            console.log(`Category ${category}: ${value}`);
            return value;
          }),
          fill: false,
          borderColor: getRandomColor(),
          tension: 0.1,
        }));

        const newChartData = {
          labels: chartLabels,
          datasets: dataSets,
        };
        
        console.log('New chart data:', newChartData);
        setChartData(newChartData);
      }
    } catch (error) {
      console.error('Error setting up chart data:', error);
      setChartData({
        labels: [],
        datasets: []
      });
    }
  }, [predictions]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) {
      return; // Prevent multiple submissions
    }

    // Get authentication token
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('Please login first');
      return;
    }

    // Validate start date
    if (!startDate) {
      alert('Please select a start date');
      return;
    }

    setIsLoading(true);
    console.log('Submitting demand prediction with startDate:', startDate);

    const requestData = {
      season: getSeasonFromDate(startDate),
      marketTrend: 'increasing', // You can make this dynamic
      population: 1000000, // You can make this dynamic
      previousDemand: 800 // You can make this dynamic
    };

    console.log('Request data:', requestData);

    try {
      const response = await fetch('http://localhost:8080/predict_potato_demand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Demand prediction response:', result);
        setPredictions([{
          date: startDate,
          predictions: {
            'POTATOES': result.predicted_demand,
            'POTATOES PREMIUM': result.predicted_demand * 1.2,
            'ORGANIC POTATO': result.predicted_demand * 0.8,
            'BABY POTATOES': result.predicted_demand * 0.6
          }
        }]);
      } else {
        console.error('Response not OK:', response.status, response.statusText);
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || 'Unknown error';
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        alert(`Failed to fetch predictions: ${errorMessage}`);
      }
          } catch (error) {
        console.error('Error fetching predictions:', error);
        alert(`Network error occurred: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

  // Helper function to determine season from date
  const getSeasonFromDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  };

  // Generate a random color for each dataset
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon">📊</div>
        <h2>Potato Demand Prediction</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'center' }}>
        Forecast potato demand using advanced analytics and market trends
      </p>
          
          <form onSubmit={handleSubmit} className="form">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="start-date">Start Date</label>
                <input 
                  type="date" 
                  id="start-date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-field">
                <label htmlFor="end-date">End Date (Optional)</label>
                <input 
                  type="date" 
                  id="end-date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                />
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="loading"></span>
                    Predicting...
                  </>
                ) : (
                  <>
                    <span>🔮</span>
                    Predict Demand
                  </>
                )}
              </button>
            </div>
          </form>

          {predictions.length > 0 && (
            <>
              <div className="card" style={{ marginTop: '2rem' }}>
                <div className="card-header">
                  <div className="card-icon">📈</div>
                  <h3>Demand Predictions</h3>
                </div>
                {predictions.map((prediction, index) => (
                  <div key={index} style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                      📅 {prediction.date}
                    </h4>
                    <div className="dashboard-stats">
                      {Object.entries(prediction.predictions).map(([category, value]) => (
                        <div key={category} className="stat-item">
                          <span className="stat-value">{value.toFixed(0)}</span>
                          <span className="stat-label">{category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="chart-container">
                <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                  📊 Demand Trend Analysis
                </h3>
                {chartData.labels.length > 0 && chartData.datasets.length > 0 ? (
                  <Line data={chartData} options={{ maintainAspectRatio: false }} />
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '2rem', 
                    color: 'var(--text-secondary)',
                    fontSize: '1.1rem'
                  }}>
                    Chart data loading...
                  </div>
                )}
              </div>
            </>
          )}
        </div>
  );
};

export default PredictPotatoDemand;
