import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import AddCompany from "./pages/addcompany";
import AddTransaction from "./pages/addtransaction";
import Analysis from "./pages/analysis";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="*" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/add-company" element={<AddCompany />} />
          <Route path="/add-transaction" element={<AddTransaction />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
