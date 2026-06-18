import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShowParticularPg, useEditParticularPg } from "../../store/info";

const AdminEditPg = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Looks up the target pgId

  // Zustand Hooks
  const { pgData, fetchData2, loading2, resetData2 } = useShowParticularPg();
  const { updatePg, submitting, error, clearEditError } = useEditParticularPg();

  // Unified Local Form State
  const [formData, setFormData] = useState({
    pgName: "",
    pgLocation: "",
    pgRent: "",
    pgSharing: "",
    pgGender: "Gents",
    description: "",
    facilities: "",
    images: [],
  });

  // 1. Fetch current PG data if not already present
  useEffect(() => {
    fetchData2(id);
    return () => {
      resetData2();
      clearEditError();
    };
  }, [id]);

  // 2. Populate form once data is received from backend
  useEffect(() => {
    if (pgData && Object.keys(pgData).length > 0) {
      setFormData({
        pgName: pgData.pgName || "",
        pgLocation: pgData.pgLocation || "",
        pgRent: pgData.pgRent || "",
        pgSharing: pgData.pgSharing || "",
        pgGender: pgData.pgGender || "Gents",
        description: pgData.description || "",
        facilities: pgData.facilities ? pgData.facilities.join(", ") : "",
        images: pgData.images || [],
      });
    }
  }, [pgData]);

  // Input Change Interceptor
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Guard clause to ensure pgData has loaded
    if (!pgData?._id) {
      console.error("PG ID not found yet.");
      return;
    }

    const payload = {
      pgName: formData.pgName,
      pgLocation: formData.pgLocation,
      pgRent: Number(formData.pgRent),
      pgSharing: Number(formData.pgSharing),
      pgGender: formData.pgGender,
      description: formData.description,
      facilities: formData.facilities
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""),
      images: formData.images,
    };

    // Pass pgData._id as the first parameter, keeping 'id' (adminId) for the redirect path
    const result = await updatePg(pgData._id, payload);

    if (result.success) {
      navigate(`/adminDashboard/${id}`); // Redirects back using the admin's ID route
    }
  };

  if (loading2) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Fetching PG information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      {/* Top Header Navigation panel */}
      <div className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800 px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Edit PG Details</h1>
          <p className="text-sm text-zinc-400">
            Modify your structural property info
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Main Editing View Area */}
      <div className="p-4 max-w-2xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 space-y-5 shadow-lg"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          {/* PG Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-400 font-medium">PG Name</label>
            <input
              type="text"
              name="pgName"
              required
              value={formData.pgName}
              onChange={handleChange}
              className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition text-white"
            />
          </div>

          {/* PG Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-400 font-medium">
              Location
            </label>
            <input
              type="text"
              name="pgLocation"
              required
              value={formData.pgLocation}
              onChange={handleChange}
              className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition text-white"
            />
          </div>

          {/* Rent & Sharing Configurations Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Rent */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-zinc-400 font-medium">
                Rent (₹)
              </label>
              <input
                type="number"
                name="pgRent"
                required
                value={formData.pgRent}
                onChange={handleChange}
                className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition text-white"
              />
            </div>

            {/* Sharing Room Capacity */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-zinc-400 font-medium">
                Sharing Capacity (No. of Bed slots)
              </label>
              <input
                type="number"
                name="pgSharing"
                required
                value={formData.pgSharing}
                onChange={handleChange}
                className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition text-white"
              />
            </div>
          </div>

          {/* Enum Selector Options matching schema limitations */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-400 font-medium">
              PG Type Category
            </label>
            <select
              name="pgGender"
              value={formData.pgGender}
              onChange={handleChange}
              className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition text-white cursor-pointer"
            >
              <option value="Gents">Gents</option>
              <option value="Ladies">Ladies</option>
            </select>
          </div>

          {/* Array Utilities Mapping */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-400 font-medium">
              Facilities (separated with commas)
            </label>
            <input
              type="text"
              name="facilities"
              required
              value={formData.facilities}
              onChange={handleChange}
              placeholder="Wifi, AC, Food, Power Backup"
              className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition text-white"
            />
          </div>

          {/* Description Block */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-400 font-medium">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition text-white resize-none"
            />
          </div>

          {/* Confirm Operational Execution Triggers */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed py-3.5 mt-2 rounded-2xl font-semibold transition cursor-pointer flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating Records...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditPg;
