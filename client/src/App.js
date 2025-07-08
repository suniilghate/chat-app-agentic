import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import User from "./User";
import Agent from "./Agent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/agent" element={<Agent />} />
      </Routes>
    </Router>
  );
}

export default App;
