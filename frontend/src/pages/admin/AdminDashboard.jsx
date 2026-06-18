import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShowParticularAdmin, useShowParticularPg } from "../../store/info";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { AdminData, fetchData, loading, resetData } = useShowParticularAdmin();
  const { pgData, fetchData2, loading2, resetData2 } = useShowParticularPg();

  // ─── Image Slider & Modal State ───────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [visibleCards, setVisibleCards] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null); // Tracks the popped-out image url
  const autoPlayRef = useRef(null);

  // ─── Responsive Viewport Listener ────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3); // Desktop: 3 cards
      } else if (window.innerWidth >= 640) {
        setVisibleCards(2); // Tablet: 2 cards
      } else {
        setVisibleCards(1); // Mobile: 1 card
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchData(id);
    return () => resetData();
  }, [id]);

  useEffect(() => {
    if (loading === false && AdminData.hasPg === false) {
      navigate(`/adminCreatePg/${id}`);
    }
  }, [AdminData, id, loading]);

  useEffect(() => {
    fetchData2(id);
    return () => resetData2();
  }, [id]);

  const images = pgData?.images || [];
  const maxIndex = Math.max(0, images.length - visibleCards);

  // ─── Auto-play logic ──────────────────────────────────────────────────────
  useEffect(() => {
    if (images.length <= visibleCards || !isAutoPlaying) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(autoPlayRef.current);
  }, [images.length, isAutoPlaying, maxIndex, visibleCards]);

  // ─── Slider Control Functions ─────────────────────────────────────────────
  const prevImage = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const nextImage = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  if (loading || loading2) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalSteps = maxIndex + 1;

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800 px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-zinc-400">Manage your PG</p>
        </div>
        <button
          className="bg-red-500 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/adminLogin");
          }}
        >
          Logout
        </button>
      </div>

      {/* ── PG Card ────────────────────────────────────────────────────────── */}
      <div className="p-4">
        <div className="bg-zinc-900 rounded-3xl overflow-hidden shadow-lg border border-zinc-800">
          {/* ── Image Slider ───────────────────────────────────────────────── */}
          {images.length > 0 ? (
            <div className="relative w-full p-4">
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
                      onClick={() => setSelectedImage(image.url)} // Triggers pop-out layout
                      style={{
                        width: `${100 / images.length}%`,
                        minWidth: `${100 / images.length}%`, // Explicit enforcement ensures absolutely no shrinking
                      }}
                    >
                      <div className="rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-800 shadow-lg h-48 sm:h-56 md:h-64 lg:h-72 transition-transform duration-300 group-hover:scale-[1.01]">
                        <img
                          src={image.url}
                          alt={`PG Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Prev Button ────────────────────────────────────────────────────── */}
              {images.length > visibleCards && (
                <button
                  onClick={prevImage}
                  disabled={currentIndex === 0}
                  className="absolute left-1 top-1/2 -translate-y-1/2 bg-zinc-900/90 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-700 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer z-10 shadow-xl text-xl font-light"
                >
                  ‹
                </button>
              )}

              {/* ── Next Button ────────────────────────────────────────────────────── */}
              {images.length > visibleCards && (
                <button
                  onClick={nextImage}
                  disabled={currentIndex >= maxIndex}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-zinc-900/90 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-700 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer z-10 shadow-xl text-xl font-light"
                >
                  ›
                </button>
              )}

              {/* ── Dot Indicators ─────────────────────────────────────────────────── */}
              {images.length > visibleCards && (
                <div className="flex justify-center gap-1.5 mt-3">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setCurrentIndex(index);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        index === currentIndex
                          ? "bg-red-500 w-5"
                          : "bg-zinc-600 w-1.5"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-48 mx-4 my-4 bg-zinc-800 flex items-center justify-center rounded-2xl border border-zinc-700">
              <p className="text-zinc-500 text-sm">No images uploaded</p>
            </div>
          )}

          {/* ── PG Details ─────────────────────────────────────────────────── */}
          <div className="p-4 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{pgData.pgName}</h2>
              <p className="text-zinc-400 text-sm mt-1">{pgData.pgLocation}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800 rounded-2xl p-4">
                <p className="text-zinc-400 text-sm">Rent</p>
                <h3 className="text-lg font-semibold mt-1">₹{pgData.pgRent}</h3>
              </div>
              <div className="bg-zinc-800 rounded-2xl p-4">
                <p className="text-zinc-400 text-sm">Sharing</p>
                <h3 className="text-lg font-semibold mt-1">
                  {pgData.pgSharing} person
                </h3>
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-center justify-between bg-zinc-800 p-4 rounded-2xl">
              <span className="text-zinc-400">PG Type</span>
              <span
                className={`font-semibold px-3 py-1 rounded-full text-sm ${
                  pgData.pgGender === "Gents"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-pink-500/20 text-pink-400"
                }`}
              >
                {pgData.pgGender}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-zinc-300 leading-relaxed text-sm">
                {pgData.description}
              </p>
            </div>

            {/* Facilities */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {pgData?.facilities?.map((item, index) => (
                  <span
                    key={index}
                    className="bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              <button
                onClick={() => {
                  navigate(`/adminEditPg/${id}`);
                }}
                className="bg-red-500 hover:bg-red-600 py-3 rounded-2xl font-semibold transition cursor-pointer"
              >
                Edit PG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pop-out Fullscreen Image Modal Backdrop ──────────────────────────── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300 p-4"
          onClick={() => setSelectedImage(null)} // Dismiss modal when background blur is clicked or touched
        >
          <div
            className="relative max-w-4xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevents closing modal when clicking the image itself
          >
            {/* Close Button shortcut for Desktop accessibility */}
            <button
              className="absolute -top-12 right-0 text-zinc-400 hover:text-white text-3xl font-light cursor-pointer hidden md:block"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Enlarged PG Detail View"
              className="w-full h-full max-h-[85vh] object-contain rounded-2xl shadow-2xl scale-100 animate-in fade-in zoom-in-95 duration-200"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
