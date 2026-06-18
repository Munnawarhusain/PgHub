import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShowPgById } from "../../store/info";

const PgUserDashboard = () => {
  const { pgId } = useParams();
  const navigate = useNavigate();

  const { currentPg, fetchPgById, loadingPg, resetCurrentPg } = useShowPgById();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setVisibleCards(3);
      else if (window.innerWidth >= 640) setVisibleCards(2);
      else setVisibleCards(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchPgById(pgId);
    return () => resetCurrentPg();
  }, [pgId]);

  const images = currentPg?.images || [];
  const maxIndex = Math.max(0, images.length - visibleCards);

  const prevImage = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const nextImage = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));

  // 1. Loading State
  if (loadingPg) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Loading PG Details...</p>
        </div>
      </div>
    );
  }

  // 2. Not Found / Error State
  if (!currentPg || Object.keys(currentPg).length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-400">Property information could not be found.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl text-sm transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  // 3. MAIN RENDER STATE
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="bg-zinc-900 border-b border-red-600 px-4 md:px-6 py-4 flex items-center gap-4 sticky top-0 z-50">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-2 md:px-4 md:py-2 rounded-xl transition border border-zinc-700 cursor-pointer text-sm md:text-base font-medium"
        >
          <span className="text-lg leading-none">←</span>
          <span className="hidden sm:block">Back</span>
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-red-600 truncate">
          Pg Details
        </h1>
      </nav>

      {/* ── Core Layout ─────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto p-4 mt-4 space-y-6">
        
        {/* Carousel Image Slider */}
        {images.length > 0 ? (
          <div className="relative w-full bg-zinc-900 p-4 rounded-3xl border border-zinc-800 shadow-xl">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / images.length)}%)`,
                  width: `${(images.length / visibleCards) * 100}%`,
                }}
              >
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="px-1.5 shrink-0 cursor-pointer group"
                    onClick={() => setSelectedImage(image.url)}
                    style={{
                      width: `${100 / images.length}%`,
                      minWidth: `${100 / images.length}%`,
                    }}
                  >
                    <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-black h-48 sm:h-56 md:h-64 lg:h-72 transition-transform duration-300 group-hover:scale-[1.01]">
                      <img
                        src={image.url}
                        alt={`Room View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {images.length > visibleCards && (
              <>
                <button
                  onClick={prevImage}
                  disabled={currentIndex === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-zinc-900/90 hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition z-10 text-xl font-bold cursor-pointer"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  disabled={currentIndex >= maxIndex}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-zinc-900/90 hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition z-10 text-xl font-bold cursor-pointer"
                >
                  ›
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-64 bg-zinc-900 flex items-center justify-center rounded-3xl border border-zinc-800">
            <p className="text-zinc-500 text-sm">No display images uploaded for this listing</p>
          </div>
        )}

        {/* ── Data Breakdown ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">{currentPg.pgName}</h2>
                <p className="text-zinc-400 text-sm mt-1">📍 {currentPg.pgLocation}</p>
              </div>
              <span className={`font-semibold px-4 py-1.5 rounded-full text-xs border ${
                currentPg.pgGender === "Gents"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "bg-pink-500/10 text-pink-400 border-pink-500/20"
              }`}>
                {currentPg.pgGender} Only
              </span>
            </div>

            <hr className="border-zinc-800" />

            <div>
              <h3 className="text-lg font-semibold text-red-500 mb-3">Room Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 border border-zinc-800 rounded-2xl p-4">
                  <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium">Sharing</p>
                  <p className="text-xl font-bold mt-1 text-zinc-200">{currentPg.pgSharing} Person</p>
                </div>
                <div className="bg-black/40 border border-zinc-800 rounded-2xl p-4">
                  <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium">Status</p>
                  <p className="text-xl font-bold mt-1 text-green-500">Available</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-red-500 mb-2">Description</h3>
              <p className="text-zinc-300 text-sm leading-relaxed font-light bg-black/20 p-4 rounded-xl border border-zinc-800/60">
                {currentPg.description}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-red-500 mb-3">Facilities</h3>
              <div className="flex flex-wrap gap-2.5">
                {currentPg.facilities?.map((utility, idx) => (
                  <span
                    key={idx}
                    className="bg-zinc-800 border border-zinc-700/60 px-4 py-2 rounded-xl text-xs font-medium text-zinc-200 tracking-wide"
                  >
                    ✓ {utility}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 h-fit space-y-6 shadow-xl sticky top-24">
            <div>
              <p className="text-zinc-400 text-sm font-medium">Monthly Rent</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-extrabold text-red-500">₹{currentPg.pgRent}</span>
                <span className="text-zinc-400 text-xs font-light">/ month</span>
              </div>
            </div>

            <hr className="border-zinc-800" />

            <div className="space-y-3">
              <button
                onClick={() => alert("Booking functionality coming soon!")}
                className="w-full bg-red-600 hover:bg-red-700 py-3.5 rounded-2xl font-bold transition tracking-wide text-sm cursor-pointer shadow-lg shadow-red-600/10"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Image Modal ─────────────────────────────────────────────────── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 transition-all duration-300 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh]">
            <img
              src={selectedImage}
              alt="Enlarged"
              className="w-full h-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PgUserDashboard;