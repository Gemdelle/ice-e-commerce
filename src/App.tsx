import React from 'react';
import './App.css';
import Home from './screens/Home/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Shop from './screens/Shop/Shop';

function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<Home param1={1} />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
