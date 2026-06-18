import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShowAllPgs } from "../../store/info";

const UserDashboard = () => {
  const navigate = useNavigate();

  // Hook up Zustand global store
  const { allPgsData, fetchAllPgs, loadingAll } = useShowAllPgs();

  // Local state controls for your layout filters
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("All"); // "All" | "Gents" | "Ladies"
  const [priceFilter, setPriceFilter] = useState(null); // null | 5000 | 8000

  // Load all items immediately when page mounts
  useEffect(() => {
    fetchAllPgs();
  }, []);

  // ─── Filter Logic ──────────────────────────────────────────────────────────
  const filteredPgs = allPgsData.filter((item) => {
    // 1. Filter by location search query string
    const matchesLocation = item.pgLocation
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    // 2. Filter by Gender targeting (Enums: "Gents" | "Ladies")
    const matchesGender =
      genderFilter === "All" || item.pgGender === genderFilter;

    // 3. Filter by maximum rent thresholds
    const matchesPrice = !priceFilter || item.pgRent <= priceFilter;

    return matchesLocation && matchesGender && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar Layout */}
      <nav className="bg-zinc-900 border-b border-red-600 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-3xl font-bold text-red-600 tracking-wide">PgHub</h1>
        <button
          className="bg-red-600 cursor-pointer hover:bg-red-700 px-5 py-2 rounded-lg font-medium transition"
          onClick={() => navigate("/userProfile")}
        >
          Profile
        </button>
      </nav>

      {/* Hero Search Block */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold">Find Your Perfect PG</h2>
        <p className="text-gray-400 mt-3">
          Discover affordable and comfortable PGs near your location.
        </p>

        <div className="mt-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by location (e.g. Noida, Salt Lake...)"
            className="w-full md:w-1/2 bg-zinc-900 border border-red-600/50 focus:border-red-600 rounded-xl p-4 outline-none transition text-white placeholder-gray-500"
          />
        </div>
      </section>

      {/* Dynamic Interactive Filter Buttons */}
      <section className="px-6 max-w-7xl mx-auto flex flex-wrap gap-3">
        {/* Gender Filters */}
        <button
          onClick={() =>
            setGenderFilter(genderFilter === "Gents" ? "All" : "Gents")
          }
          className={`px-5 py-2 rounded-full font-medium transition cursor-pointer border ${
            genderFilter === "Gents"
              ? "bg-red-600 border-red-600 text-white"
              : "bg-zinc-900 border-red-600/40 text-gray-300 hover:border-red-600"
          }`}
        >
          Boys
        </button>

        <button
          onClick={() =>
            setGenderFilter(genderFilter === "Ladies" ? "All" : "Ladies")
          }
          className={`px-5 py-2 rounded-full font-medium transition cursor-pointer border ${
            genderFilter === "Ladies"
              ? "bg-red-600 border-red-600 text-white"
              : "bg-zinc-900 border-red-600/40 text-gray-300 hover:border-red-600"
          }`}
        >
          Girls
        </button>

        {/* Budget Filters */}
        <button
          onClick={() => setPriceFilter(priceFilter === 5000 ? null : 5000)}
          className={`px-5 py-2 rounded-full font-medium transition cursor-pointer border ${
            priceFilter === 5000
              ? "bg-red-600 border-red-600 text-white"
              : "bg-zinc-900 border-red-600/40 text-gray-300 hover:border-red-600"
          }`}
        >
          Under ₹5000
        </button>

        <button
          onClick={() => setPriceFilter(priceFilter === 8000 ? null : 8000)}
          className={`px-5 py-2 rounded-full font-medium transition cursor-pointer border ${
            priceFilter === 8000
              ? "bg-red-600 border-red-600 text-white"
              : "bg-zinc-900 border-red-600/40 text-gray-300 hover:border-red-600"
          }`}
        >
          Under ₹8000
        </button>

        <button
          onClick={() => setPriceFilter(priceFilter === 15000 ? null : 15000)}
          className={`px-5 py-2 rounded-full font-medium transition cursor-pointer border ${
            priceFilter === 15000
              ? "bg-red-600 border-red-600 text-white"
              : "bg-zinc-900 border-red-600/40 text-gray-300 hover:border-red-600"
          }`}
        >
          Under ₹15000
        </button>
      </section>

      {/* Main Listings Grid Area */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold mb-6 text-red-500">Available PGs</h3>

        {loadingAll ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-500 text-sm">Scanning live properties...</p>
          </div>
        ) : filteredPgs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPgs.map((pgItem) => {
              // Fallback to placeholder if cloud images array is unpopulated
              const displayImage =
                pgItem.images?.length > 0
                  ? pgItem.images[0].url
                  : "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85";

              return (
                <div
                  key={pgItem._id}
                  className="bg-zinc-900 rounded-2xl overflow-hidden hover:scale-[1.03] transition-all duration-300 border border-zinc-800 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={displayImage}
                      alt={pgItem.pgName}
                      className="w-full h-56 object-cover"
                    />

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xl font-bold truncate">
                          {pgItem.pgName}
                        </h4>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            pgItem.pgGender === "Gents"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                          }`}
                        >
                          {pgItem.pgGender}
                        </span>
                      </div>

                      <p className="text-gray-400 mt-2 text-sm truncate">
                        📍 {pgItem.pgLocation}
                      </p>

                      <p className="mt-2 text-red-500 font-bold text-lg">
                        ₹{pgItem.pgRent}/month
                      </p>

                      <p className="mt-1 text-sm text-zinc-300">
                        🛏️ {pgItem.pgSharing} Sharing configuration
                      </p>

                      {/* Facilities Array chips block */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {pgItem.facilities
                          ?.slice(0, 4)
                          .map((facility, index) => (
                            <span
                              key={index}
                              className="bg-black border border-red-600/30 px-3 py-1 rounded-full text-xs text-zinc-300"
                            >
                              {facility}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Route triggering redirection hook */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => navigate(`/pgDetails/${pgItem._id}`)}
                      className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition cursor-pointer text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/40 rounded-3xl border border-zinc-800">
            <p className="text-zinc-500 text-lg">
              No matching PG accommodations found.
            </p>
            <p className="text-zinc-600 text-sm mt-1">
              Try adjusting your location tags or price sliders.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
