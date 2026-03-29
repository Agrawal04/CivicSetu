import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ComplaintForm from "./components/ComplaintForm";
import ComplaintsList from "./components/ComplaintsList";
import EditProfile from "./components/EditProfile";
import StaffLogin from "./components/StaffLogin";
import PublicComplaints from "./components/PublicComplaints";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/complaint/new" element={<ComplaintForm />} />
        <Route path="/complaints" element={<ComplaintsList />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/complaints/public" element={<PublicComplaints />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
export default App;
