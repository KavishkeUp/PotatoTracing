import React, { useState, useEffect, useRef } from 'react';
import config from '../config';

const PredictPotatoPrice = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const formRef = useRef(null);

  // Debug state changes
  useEffect(() => {
    console.log('State changed - prediction:', prediction, 'error:', error, 'loading:', loading, 'showResult:', showResult);
    
    // Ensure result stays visible if we have a prediction
    if (prediction !== null && !showResult) {
      console.log('Fixing: prediction exists but showResult is false, setting showResult to true');
      setShowResult(true);
    }
  }, [prediction, error, loading, showResult]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Form submitted, starting prediction...');
    
    // Reset states but keep previous result visible
    setError(null);
    setLoading(true);
    // Don't hide result immediately - let it show until new result comes
    // setShowResult(false);
    
    // Get authentication token
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setError('Please login first');
      setLoading(false);
      setShowResult(true);
      return;
    }
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    console.log('Sending prediction request:', data);

    try {
      const response = await fetch(`${config.API_BASE_URL}/predict_potato_prices`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          temp: parseFloat(data.temp),
          disaster: data.disaster,
          condition: data.condition,
          variety: data.variety,
          rainfall: parseFloat(data.rainfall),
          origin: data.origin,
          organic: data.organic,
          location: data.location
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const result = await response.json();
        console.log('Prediction result:', result);
        
        // Set prediction and show result
        setPrediction(result.predicted_price);
        setError(null);
        setShowResult(true);
        console.log('Prediction set and result shown:', {
          prediction: result.predicted_price,
          showResult: true,
          method: result.prediction_method,
          confidence: result.confidence
        });
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        setError(`Failed to predict price: ${errorData.message || 'Unknown error'}`);
        setPrediction(null);
        setShowResult(true);
      }
    } catch (error) {
      console.error('Network Error:', error);
      setError(`Network error: ${error.message}`);
      setPrediction(null);
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setPrediction(null);
    setError(null);
    setShowResult(false);
    console.log('Result cleared');
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon">💰</div>
        <h2>Potato Price Prediction</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'center' }}>
        Analyze market factors to predict potato prices using AI algorithms
      </p>
          
          <form ref={formRef} onSubmit={handleSubmit} className="form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="temp">Temperature (°C)</label>
                <input 
                  type="number" 
                  id="temp" 
                  name="temp" 
                  placeholder="Enter temperature"
                  required 
                />
              </div>

              <div className="form-field">
                <label htmlFor="disaster">Disaster Condition</label>
                <select id="disaster" name="disaster" required>
                  <option value="">Select condition</option>
                  <option value="none">None</option>
                  <option value="flood">Flood</option>
                  <option value="drought">Drought</option>
                  <option value="storm">Storm</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="condition">Crop Condition</label>
                <select id="condition" name="condition" required>
                  <option value="">Select condition</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="variety">Potato Variety</label>
                <select id="variety" name="variety" required>
                  <option value="">Select variety</option>
                  <option value="organic">Organic</option>
                  <option value="russet">Russet</option>
                  <option value="red">Red</option>
                  <option value="yellow">Yellow</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="rainfall">Rainfall (mm)</label>
                <input 
                  type="number" 
                  id="rainfall" 
                  name="rainfall" 
                  placeholder="Enter rainfall amount"
                  required 
                />
              </div>

              <div className="form-field">
                <label htmlFor="organic">Organic Status</label>
                <select id="organic" name="organic" required>
                  <option value="">Select status</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="origin">Origin</label>
                <input 
                  type="text" 
                  id="origin" 
                  name="origin" 
                  placeholder="Enter origin location"
                  required 
                />
              </div>

              <div className="form-field">
                <label htmlFor="location">Market Location</label>
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  placeholder="Enter market location"
                  required 
                />
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <span>{loading ? '⏳' : '🔮'}</span>
                {loading ? 'Predicting...' : 'Predict Price'}
              </button>
            </div>
            
            {/* Loading indicator that doesn't interfere with results */}
            {loading && (
              <div style={{ marginTop: '1rem', textAlign: 'center', color: '#666' }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>⏳</div>
                <div>Processing prediction...</div>
              </div>
            )}
          </form>

          {/* Error Message */}
          {showResult && error && (
            <div className="card fade-in" style={{ marginTop: '2rem', textAlign: 'center', background: '#dc3545', color: 'white' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❌</div>
              <div style={{ fontSize: '1.2rem' }}>
                {error}
              </div>
              <button 
                onClick={clearResult}
                style={{ 
                  marginTop: '1rem', 
                  padding: '0.5rem 1rem', 
                  background: 'rgba(255,255,255,0.2)', 
                  border: 'none', 
                  color: 'white', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            </div>
          )}

          {/* Simple Popup for Prediction Result */}
          {showResult && prediction !== null && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10000
            }}>
              <div style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '2rem',
                borderRadius: '10px',
                textAlign: 'center',
                maxWidth: '400px',
                width: '90%',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Predicted Price
                </div>
                <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  LKR {prediction.toFixed(2)}
                </div>
                <div style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '1rem' }}>
                  per kilogram
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '1.5rem' }}>
                  Prediction successful! ✅
                </div>
                <button 
                  onClick={clearResult}
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    background: 'rgba(255,255,255,0.2)', 
                    border: '2px solid rgba(255,255,255,0.3)', 
                    color: 'white', 
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}


        </div>
  );
};

export default PredictPotatoPrice;
