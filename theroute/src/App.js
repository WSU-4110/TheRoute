import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Map from './pages/Map';
import {Setup} from './pages/Setup';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <nav className="navbar">
        <div className="buttons">
          <Link to="/map">Maps</Link>
          <Link to="/setup">Trips</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/map" element={<Map />} />
        <Route path="/setup" element={<Setup/>}/>
      </Routes>
      
    </Router>
  );
};

export default App;