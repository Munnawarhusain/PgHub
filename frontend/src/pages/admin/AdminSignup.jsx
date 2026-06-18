import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminSignup = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone_no, setPhone_no] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const navigate = useNavigate();

  const createAdmin = async (e) => {
    // e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/createAdmin",
        { fullname, username, email, phone_no, password },
      );
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      navigate(`/adminDashboard/${response.data.data._id}`, { replace: true });
      alert("!New Admin Created");
    } catch (error) {
      setFullname("");
      setUsername("");
      setEmail("");
      setPhone_no("");
      setPassword("");
      setPasswordCheck("");
      console.log(error.response.data.message);
      alert(error.response.data.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === passwordCheck) {
      createAdmin();
    } else {
      setPassword("");
      setPasswordCheck("");
      alert("passwords are not matching");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-zinc-900 text-white rounded-2xl p-6 shadow-lg">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account as Admin
        </h1>

        {/* Form */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={fullname}
              onChange={(e) => {
                setFullname(e.target.value);
              }}
              className="bg-black border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="bg-black border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          {/* Username */}
          <div className="flex flex-col gap-2">
            <label>username</label>

            <input
              type="text"
              value={username}
              placeholder="Enter username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="bg-black border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          {/* Phone number */}
          <div className="flex flex-col gap-2">
            <label>Phone Number</label>

            <input
              type="number"
              value={phone_no}
              placeholder="Enter phone number"
              onChange={(e) => {
                setPhone_no(e.target.value);
              }}
              className="bg-black border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="bg-black border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label>Confirm Password</label>

            <input
              type="password"
              name="passwordCheck"
              placeholder="Confirm your password"
              value={passwordCheck}
              onChange={(e) => {
                setPasswordCheck(e.target.value);
              }}
              className="bg-black border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="bg-red-700 cursor-pointer hover:bg-red-800 transition mt-3 py-3 rounded-lg text-lg font-semibold"
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/adminLogin" className="text-red-500 hover:underline">
            Login
          </Link>
        </p>
        <p className="text-center text-gray-400 mt-6">
          Login as user?{" "}
          <Link to="/userLogin" className="text-red-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminSignup;
