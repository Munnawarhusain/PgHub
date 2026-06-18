import React from "react";

const UserProfile = () => {
  const user = {
    fullname: "Munnawar Husain",
    username: "munnawar123",
    email: "munnawar@gmail.com",
    phone_no: "9876543210",
  };

  const handleLogout = () => {
    localStorage.removeItem("Usertoken");
    window.location.href = "/userLogin";
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-lg bg-zinc-900 rounded-2xl shadow-xl border border-red-700 p-6">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-red-700 flex items-center justify-center text-4xl font-bold">
            {user.fullname.charAt(0)}
          </div>

          <h1 className="mt-4 text-3xl font-bold">
            {user.fullname}
          </h1>

          <p className="text-gray-400">
            @{user.username}
          </p>
        </div>

        {/* User Details */}
        <div className="mt-8 space-y-4">
          <div className="bg-black p-4 rounded-lg border border-zinc-700">
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-lg">{user.email}</p>
          </div>

          <div className="bg-black p-4 rounded-lg border border-zinc-700">
            <p className="text-gray-400 text-sm">Phone Number</p>
            <p className="text-lg">{user.phone_no}</p>
          </div>

          <div className="bg-black p-4 rounded-lg border border-zinc-700">
            <p className="text-gray-400 text-sm">Username</p>
            <p className="text-lg">{user.username}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <button className="w-full bg-red-700 hover:bg-red-800 py-3 rounded-lg font-semibold transition">
            Edit Profile
          </button>

          <button
            onClick={handleLogout}
            className="w-full border cursor-pointer border-red-700 text-red-500 hover:bg-red-700 hover:text-white py-3 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;