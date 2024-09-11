import React from 'react';
import './App.css';
import Home from './screens/Home/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Products from './screens/Products/Products';

function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<Home param1={1} />} />
        <Route path="/products" element={<Products param1={2} />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
