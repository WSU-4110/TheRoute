import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Map from './pages/Map';
import { Setup } from './pages/Setup';
import AddExpense from './components/AddExpenses';
import ViewExpense from './components/ViewExpenses';
import Sidebar from './components/SideBar';
import ViewTrips from './pages/ViewTrips';
import ViewAchievements from './components/ViewAchievements'; // Import ViewAchievements component
import AchievementNotifications from './components/AchievementNotifications'; // Import AchievementNotifications component

function App() {
  return (
    <Router>
      <Sidebar />
      
      {/* Add AchievementNotifications globally */}
      <AchievementNotifications />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/map" element={<Map />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/view-expense" element={<ViewExpense />} />
        <Route path="/view-trips" element={<ViewTrips />} />
        <Route path="/view-achievements" element={<ViewAchievements />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;
