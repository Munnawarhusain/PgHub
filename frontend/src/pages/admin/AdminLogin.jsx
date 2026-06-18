import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginAdmin = async (e) =>{
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/signInAdmin",
        {username,password}
      )
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      navigate(`/adminDashboard/${response.data.data._id}`, { replace: true });
      alert("!Login successfull");
    } catch (error) {
      setUsername("");
      setPassword("");
      console.log(error.response.data.message);
      alert(error.response.data.message);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 text-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Login as Admin</h1>

        <form className="flex flex-col gap-5" onSubmit={loginAdmin}>
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter your email"
              value={username}
              onChange={(e)=>{
                setUsername(e.target.value);
              }}
              className="bg-black border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e)=>{
                setPassword(e.target.value);
              }}
              className="bg-black border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right text-sm text-gray-400 cursor-pointer hover:text-white">
            Forgot Password?
          </div>

          {/* Button */}
          <button
            type="submit"
            className="bg-red-700 cursor-pointer hover:bg-red-800 transition py-3 rounded-lg text-lg font-semibold"
          >
            Login
          </button>
        </form>

        {/* Signup */}
        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link
            to="/adminSignup"
            className="text-red-500 cursor-pointer hover:underline"
          >
            Sign Up
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

export default AdminLogin;