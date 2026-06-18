import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const facilityOptions = [
  "WiFi",
  "Food",
  "AC",
  "Laundry",
  "Parking",
  "CCTV",
  "Power Backup",
  "Housekeeping",
  "RO Water",
];

const token = localStorage.getItem("token");

export default function CreatePg() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pgName: "",
    pgLocation: "",
    pgRent: "",
    pgSharing: "",
    pgGender: "Gents",
    description: "",
    facilities: [],
  });

  // ─── Separate state for images ────────────────────────────────────────────
  // Images are files, not plain strings, so they live outside the formData object
  // We store the raw File objects from the input, and preview URLs for display
  const [imageFiles, setImageFiles] = useState([]); // actual File objects → sent to backend
  const [imagePreviews, setImagePreviews] = useState([]); // blob URLs → shown in UI only
  const [loading, setLoading] = useState(false);

  // ─── Handle all text/radio/number inputs ──────────────────────────────────
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ─── Handle facility checkbox toggle ──────────────────────────────────────
  const handleFacility = (facility) => {
    if (formData.facilities.includes(facility)) {
      setFormData({
        ...formData,
        facilities: formData.facilities.filter((item) => item !== facility),
      });
    } else {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, facility],
      });
    }
  };

  // ─── Handle image file selection ──────────────────────────────────────────
  // e.target.files is a FileList (not an array), so we spread it into an array
  // URL.createObjectURL() creates a temporary local URL for preview in the browser
  // These preview URLs are never sent to the backend — only the File objects are
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);

    if (newFiles.length === 0) return;

    // Generate preview URLs from the File objects
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // ✅ Reset the input value so onChange fires even if
    // the user picks the same file again in the next session
    e.target.value = "";
  };

  // ─── Remove a specific image from selection ───────────────────────────────
  const removeImage = (index) => {
    // Revoke the blob URL to free browser memory
    URL.revokeObjectURL(imagePreviews[index]);

    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Handle form submission ───────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation for images
    if (imageFiles.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    // ── Build a FormData object ──────────────────────────────────────────────
    // WHY FormData instead of plain JSON?
    // axios sends JSON by default (Content-Type: application/json)
    // But files CANNOT be sent as JSON — they must be sent as
    // multipart/form-data. FormData handles this automatically.
    // express-fileupload on the backend only reads multipart requests,
    // so this is required for req.files to be populated.
    const data = new FormData();

    // Append all plain text fields
    data.append("pgName", formData.pgName);
    data.append("pgLocation", formData.pgLocation);
    data.append("pgRent", formData.pgRent);
    data.append("pgSharing", formData.pgSharing);
    data.append("pgGender", formData.pgGender);
    data.append("description", formData.description);

    // Append facilities array
    // FormData doesn't support arrays natively, so we append each item
    // individually under the same key. On the backend, express reads
    // multiple values with the same key as an array automatically.
    formData.facilities.forEach((facility) => {
      data.append("facilities", facility);
    });

    // Append each image file under the key "images"
    // This key MUST match req.files.images on the backend
    imageFiles.forEach((file) => {
      data.append("images", file);
    });

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:3000/api/createPg/${id}`,
        data, // ← FormData object, NOT the plain formData state
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // DO NOT manually set Content-Type here
            // When you pass FormData, axios sets it automatically to
            // multipart/form-data with the correct boundary string.
            // Setting it manually breaks the boundary and the backend
            // will not be able to parse the request.
          },
        },
      );

      alert("PG created successfully!");
      navigate(`/adminDashboard/${id}`, { replace: true });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-3xl bg-zinc-900 rounded-2xl shadow-2xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center text-red-500 mb-8">
          Create Your PG
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="pgName"
            placeholder="PG Name"
            value={formData.pgName}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black border border-zinc-700 text-white focus:border-red-500 outline-none"
          />

          <input
            type="text"
            name="pgLocation"
            placeholder="Location"
            value={formData.pgLocation}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black border border-zinc-700 text-white focus:border-red-500 outline-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              name="pgRent"
              placeholder="Monthly Rent"
              value={formData.pgRent}
              onChange={handleChange}
              className="p-3 rounded-lg bg-black border border-zinc-700 text-white focus:border-red-500 outline-none"
            />

            <input
              type="number"
              name="pgSharing"
              placeholder="Sharing Capacity"
              value={formData.pgSharing}
              onChange={handleChange}
              className="p-3 rounded-lg bg-black border border-zinc-700 text-white focus:border-red-500 outline-none"
            />
          </div>

          <div>
            <h3 className="text-white mb-3">Gender</h3>
            <div className="flex gap-6">
              <label className="text-white flex items-center gap-2">
                <input
                  type="radio"
                  name="pgGender"
                  value="Gents"
                  checked={formData.pgGender === "Gents"}
                  onChange={handleChange}
                />
                Gents
              </label>
              <label className="text-white flex items-center gap-2">
                <input
                  type="radio"
                  name="pgGender"
                  value="Ladies"
                  checked={formData.pgGender === "Ladies"}
                  onChange={handleChange}
                />
                Ladies
              </label>
            </div>
          </div>

          <textarea
            rows="4"
            name="description"
            placeholder="Describe your PG..."
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black border border-zinc-700 text-white focus:border-red-500 outline-none"
          />

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Facilities
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {facilityOptions.map((facility) => (
                <label
                  key={facility}
                  className="flex items-center gap-2 text-white bg-black border border-zinc-700 rounded-lg p-3 hover:border-red-500 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.facilities.includes(facility)}
                    onChange={() => handleFacility(facility)}
                  />
                  {facility}
                </label>
              ))}
            </div>
          </div>

          {/* ── Image Upload Section ────────────────────────────────────── */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">PG Images</h3>

            {/* File input — multiple allows selecting more than one file */}
            <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-600 hover:border-red-500 rounded-lg p-6 cursor-pointer transition">
              <span className="text-zinc-400 text-sm mb-1">
                Click to upload images
              </span>
              <span className="text-zinc-600 text-xs">
                JPEG, PNG, WEBP supported
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Image previews — only shown after files are selected */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    {/* ✅ src must be the blob URL string from imagePreviews */}
                    <img
                      src={preview}
                      alt={`pg-image-${index}`}
                      className="w-full h-24 object-cover rounded-lg border border-zinc-700"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            {loading ? "Uploading..." : "CREATE PG"}
          </button>
        </form>
      </div>
    </div>
  );
}
