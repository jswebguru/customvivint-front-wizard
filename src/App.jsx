import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NavigationPage from "./pages/Navigation";
import AddReportPage from "./pages/AddReport";
import BottomNavigation from "./components/BottomNavigation";
function App() {
  return (
    <Router>
      <div className="app-content">
        <Routes>
          <Route path="/" element={<NavigationPage />} />
          <Route path="/add-report" element={<AddReportPage />} />
        </Routes>
      </div>
      <BottomNavigation />
      <ToastContainer />
    </Router>
  );
}

export default App;
