// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SelectUserTypePage from './pages/SelectUserTypePage';
import './App.css';
import './styles/ProfessionalUI.css';
import UserLoginPage from './pages/UserLoginPage';
import FarmerDashboard from './pages/FarmerDashboard';
import NewRecord from './components/NewRecord';
import PastRecords from './components/PastRecords';
import RegisterUserPage from './pages/RegisterUserPage';
import ClerkDashboard from './pages/ClerkDashboard';
import NewCollection from './components/NewCollection';
import PastCollections from './components/PastCollections'; // You'll need to create this
import DistributorDashboard from './pages/DistributorDashboard';
import NewDelivery from './components/NewDelivery';
import PastDeliveries from './components/PastDeliveries';
import SupermarketDashboard from './pages/SupermarketDashboard';
import ReceiveDelivery from './components/ReceiveDelivery';
import ReceivedDeliveries from './components/ReceivedDeliveries';
import PredictPotatoPrice from './components/PredictPotatoPrice'; 
import PredictPotatoDemand from './components/PredictPotatoDemand'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLoginPage />} />
        <Route path="/create-new-user" element={<RegisterUserPage />} />
        <Route path="/SelectUserTypePage" element={<SelectUserTypePage />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />}>
          <Route path="new-record" element={<NewRecord />} />
          <Route path="past-records" element={<PastRecords />} />
        </Route>
        <Route path="/Clerk-Dashboard" element={<ClerkDashboard />}>
          <Route path="new-collection" element={<NewCollection />} />
          <Route path="past-collections" element={<PastCollections />} />
        </Route>
        <Route path="/distributor-dashboard" element={<DistributorDashboard />}>
          <Route path="new-delivery" element={<NewDelivery />} />
          <Route path="past-deliveries" element={<PastDeliveries />} />
        </Route>
        <Route path="/supermarket-dashboard" element={<SupermarketDashboard />}>
          <Route path="receive-delivery" element={<ReceiveDelivery />} />
          <Route path="received-deliveries" element={<ReceivedDeliveries />} />
          <Route path="predict-potato-price" element={<PredictPotatoPrice />} />
          <Route path="predict-potato-demand" element={<PredictPotatoDemand />} /> 
        </Route>



        {/* Add more routes here for your login pages */}
      </Routes>
    </Router>
  );
}

export default App;
