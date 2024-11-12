import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Map from './pages/Map';
<<<<<<< HEAD
import { Setup } from './pages/Setup';
import AddExpense from './components/AddExpenses';
import ViewExpense from './components/ViewExpenses';
=======
import {Setup} from "./pages/Setup";
import AddExpense from "./components/AddExpenses";
import ViewExpense from "./components/ViewExpenses";
>>>>>>> 03be9f4 (Added viewtrips route to App.js)
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
<<<<<<< HEAD
        <Route path="/setup" element={<Setup />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/view-expense" element={<ViewExpense />} />
        <Route path="/view-trips" element={<ViewTrips />} />
=======
        <Route path="/setup" element = {<Setup/>}/>
        <Route path="/add-expense" element = {<AddExpense/>}/>
        <Route path="/view-expense" element = {<ViewExpense/>}/>
        <Route path="/view-trips" element = {<ViewTrips/>}/>
>>>>>>> 03be9f4 (Added viewtrips route to App.js)
      </Routes>
    </Router>
  );
}

export default App;
