import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCreatePg from "./pages/admin/AdminCreatePg";
import ProtectedRoute from "./ProtectedRoute";
import UserDashboard from "./pages/user/UserDashboard";
import UserProfile from "./pages/user/UserProfile";
import AdminEditPg from "./pages/admin/AdminEditPg";
import PgUserDashboard from "./pages/user/PgUserDashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/userLogin" element={<UserLogin />} />
      <Route path="/userSignup" element={<UserSignup />} />
      <Route path="/adminLogin" element={<AdminLogin />} />
      <Route path="/adminSignup" element={<AdminSignup />} />
      <Route path="/userDashboard/:id" element={<UserDashboard />} />
      <Route path="/pgDetails/:pgId" element={<PgUserDashboard />} />
      <Route path="/userProfile" element={<UserProfile />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/adminDashboard/:id" element={<AdminDashboard />} />
        <Route path="/adminCreatePg/:id" element={<AdminCreatePg />} />
        <Route path="/adminEditPg/:id" element={<AdminEditPg />} />
      </Route>
    </Routes>
  );
};

export default App;
