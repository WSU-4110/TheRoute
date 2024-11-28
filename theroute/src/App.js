/*
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

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/map" element={<Map />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/view-expense" element={<ViewExpense />} />
        <Route path="/view-trips" element={<ViewTrips />} />
      </Routes>
    </Router>
  );
}

export default App;
*/
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Map from './pages/Map';
import { Setup } from './pages/Setup';
import AddExpense from './components/AddExpenses';
import ViewExpense from './components/ViewExpenses';
import ViewAchievements from './components/ViewAchievements'; // Import ViewAchievements
import AchievementNotifications from './components/AchievementNotifications'; // Import AchievementNotifications
import Sidebar from './components/SideBar';
import ViewTrips from './pages/ViewTrips';

function App() {
  return (
    <Router>
      <Sidebar />
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
        <Route path="/view-achievements" element={<ViewAchievements />} /> {/* Add ViewAchievements route */}
      </Routes>
    </Router>
  );
}

export default App;