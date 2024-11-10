import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Map from './pages/Map';
import Setup from "./pages/Setup";
import AddExpense from "./pages/AddExpenses";
import ViewExpense from "./pages/ViewExpenses";
import Sidebar from './pages/SideBar';


function App () {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/map" element={<Map />} />
        <Route path="/setup" element = {<Setup/>}/>
        <Route path="/add-expense" element = {<AddExpense/>}/>
        <Route path="/view-expense" element = {<ViewExpense/>}/>
      </Routes>
    </Router>
  );
};

export default App;
