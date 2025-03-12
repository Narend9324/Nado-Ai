import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import AddKnowledgeBasePage from "./pages/AddKnowledgeBasePage";

function App() {
  return (
    // <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<KnowledgeBasePage />} />
          <Route path="/add-knowledge-base" element={<AddKnowledgeBasePage />} />
        </Routes>
      </div>
    // </Router>
  );
}

export default App;
