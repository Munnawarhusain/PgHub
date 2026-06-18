import axios from "axios";
import { create } from "zustand";

// This will fetch the details of a particular admin -
export const useShowParticularAdmin = create((set) => ({
  loading: false,
  AdminData: {},
  fetchData: async (id) => {
    const token = localStorage.getItem("token");
    set({ loading: true });
    try {
      const res = await axios.get(
        `http://localhost:3000/api/getParticularAdmin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      set({ AdminData: res.data.data, loading: false });
    } catch (error) {
      console.log(error.message);
      set({ loading: false });
    }
  },
  resetData: () => set({ AdminData: {}, loading: false }),
}));

// This will fetch the details of a particular pg which was created by admin -
export const useShowParticularPg = create((set) => ({
  loading2: false,
  pgData: {},
  fetchData2: async (id) => {
    set({ loading2: true });
    try {
      const res = await axios.get(
        `http://localhost:3000/api/getParticularPg/${id}`,
      );
      set({ pgData: res.data.data, loading2: false });
    } catch (error) {
      console.log(error.message);
      set({ loading2: false });
    }
  },
  resetData2: () => set({ pgData: {}, loading2: false }),
}));

// NEW: This manages editing/updating your specific PG entry -
// Update this specific action inside your useEditParticularPg store:
export const useEditParticularPg = create((set) => ({
  submitting: false,
  error: null,
  updatePg: async (pgId, updatedPayload) => { // Accept pgId here
    set({ submitting: true, error: null });
    try {
      const res = await axios.put(
        `http://localhost:3000/api/editParticularPg/${pgId}`, // Correctly points to pgId
        updatedPayload
      );
      set({ submitting: false });
      return { success: true, data: res.data.data };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to update PG details";
      console.log("Edit API Error:", errorMsg);
      set({ submitting: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },
  clearEditError: () => set({ error: null, submitting: false }),
}));

// This will fetch all PGs across the entire platform for user browsing
export const useShowAllPgs = create((set) => ({
  loadingAll: false,
  allPgsData: [],
  fetchAllPgs: async () => {
    set({ loadingAll: true });
    try {
      const res = await axios.get("http://localhost:3000/api/getAllPgs");
      set({ allPgsData: res.data.data, loadingAll: false });
    } catch (error) {
      console.log("Error fetching all Pgs: ", error.message);
      set({ loadingAll: false });
    }
  },
}));

// Add this to info.js
export const useShowPgById = create((set) => ({
  loadingPg: false,
  currentPg: {},
  fetchPgById: async (pgId) => {
    set({ loadingPg: true });
    try {
      const res = await axios.get(`http://localhost:3000/api/getPgById/${pgId}`);
      set({ currentPg: res.data.data, loadingPg: false });
    } catch (error) {
      console.log("Error fetching PG details:", error.message);
      set({ loadingPg: false });
    }
  },
  resetCurrentPg: () => set({ currentPg: {}, loadingPg: false }),
}));