import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { AthleteForm } from "./components/AthleteForm";
import { AthleteDashboard } from "./components/AthleteDashboard";
import { AthleteAttendance } from "./components/Attendence";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <Navigation />

        {/* Main Routes */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<AthleteForm />} />
            <Route path="/dashboard" element={<AthleteDashboard />} />
            <Route path="/attendance" element={<AthleteAttendance />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
