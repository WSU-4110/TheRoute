import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Map from './pages/Map';
import AddExpense from './pages/AddExpenses';
import ViewExpenses from './pages/ViewExpenses';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/map" element={<Map />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/view-expenses" element={<ViewExpenses />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;