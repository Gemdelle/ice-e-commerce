import React from 'react';
import './App.css';
import Home from './screens/Home/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./screens/Login/Login";
import Register from "./screens/Register/Register";

function App() {
  return (
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home param1={1} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </div>
  );
}

export default App;
