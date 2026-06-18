import pg from "../models/pgModel.js";
import admin from "../models/adminModel.js";
import cloudinary from "../config/cloudinary.js";

// This api is to create pg by the admin -
export const createPg = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      pgName,
      pgLocation,
      pgRent,
      pgSharing,
      pgGender,
      description,
      facilities,
    } = req.body;

    // ─── STEP 1: Validate required text fields ─────────────────────────────
    if (
      !pgName ||
      !pgLocation ||
      !pgRent ||
      !pgSharing ||
      !pgGender ||
      !description ||
      !facilities
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ─── STEP 2: Validate that images were uploaded ────────────────────────
    // req.files is populated by express-fileupload middleware in server.js
    // req.files.images maps to the field name "images" sent from the frontend form
    if (!req.files || !req.files.images) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // ─── STEP 3: Normalize files to an array ──────────────────────────────
    // express-fileupload gives a plain object for 1 file, array for multiple
    // We always convert to array so the .map() below works in both cases
    let imageFiles = req.files.images;
    if (!Array.isArray(imageFiles)) {
      imageFiles = [imageFiles];
    }

    // ─── STEP 4: Validate file types (only images allowed) ────────────────
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    const invalidFile = imageFiles.find(
      (file) => !allowedMimeTypes.includes(file.mimetype)
    );
    if (invalidFile) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type: "${invalidFile.name}". Only JPEG, PNG, and WEBP are allowed.`,
      });
    }

    // ─── STEP 5: Check if admin exists ────────────────────────────────────
    const adminExists = await admin.findById(id);
    if (!adminExists) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // ─── STEP 6: Check if admin already has a PG ──────────────────────────
    const existingPg = await pg.findOne({ pgAdmin: id });
    if (existingPg) {
      return res.status(400).json({
        success: false,
        message: "Admin already has a PG",
      });
    }

    // ─── STEP 7: Upload all images to Cloudinary in parallel ───────────────
    // file.tempFilePath is the disk path where express-fileupload saved the file
    // cloudinary.uploader.upload() reads from that path and uploads to Cloudinary
    // Promise.all() runs ALL uploads simultaneously instead of one by one
    const sanitizedPgName = pgName.trim().replace(/\s+/g, "_").toLowerCase();

    const uploadPromises = imageFiles.map((file) =>
      cloudinary.uploader.upload(file.tempFilePath, {
        folder: `pgfinder/pgs/${sanitizedPgName}`, // ← use sanitized name
        resource_type: "image",
      })
    );

    const uploadResults = await Promise.all(uploadPromises);

    // ─── STEP 8: Extract only the secure URLs from Cloudinary's response ───
    // result.secure_url is the https:// link you store in DB and show in frontend
    // result.public_id is saved too — you'll need it later to DELETE images
    const imageData = uploadResults.map((result) => ({
      url: result.secure_url,
      public_id: result.public_id, // save this if you want delete/update later
    }));

    // Extract just the URL strings for the images array in the schema
    // Your pgModel stores images as [String], so we store the secure URLs
    const imageUrls = imageData.map((img) => img.url);

    // ─── STEP 9: Create the PG document in MongoDB ────────────────────────
    const newPg = await pg.create({
      pgName,
      pgLocation,
      pgRent,
      pgSharing,
      pgGender,
      description,
      facilities,
      images: imageData,   // ← the uploaded Cloudinary URLs go here
      pgAdmin: adminExists._id,
    });

    // ─── STEP 10: Update admin document ───────────────────────────────────
    await admin.findByIdAndUpdate(id, {
      hasPg: true,
      pgId: newPg._id,
    });

    return res.status(201).json({
      success: true,
      message: "PG created successfully",
      data: newPg,
    });

  } catch (error) {
    console.error("Error creating PG:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// This api is to edit pg by admin -
export const editParticularPg = async (req, res) => {
  const { pgId } = req.params; // This parameter is receiving the admin's ID from frontend
  try {
    const newPg = req.body;

    // Querying by the 'pgAdmin' schema field instead of findById
    const updatedPg = await pg.findByIdAndUpdate(
      pgId,
      newPg,
      { new: true }
    );

    if (!updatedPg) {
      return res.status(404).json({ success: false, message: "PG not found for this admin" });
    }

    res.status(200).json({ success: true, data: updatedPg });
  } catch (error) {
    console.log(`The error is ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// This api is to get all pgs -
export const getAllPgs = async (req, res) => {
  try {
    // Fetch all PG listings from the database
    const allPgs = await pg.find({});
    res.status(200).json({ success: true, data: allPgs });
  } catch (error) {
    console.log(`The error is ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// This api is to get particular pg by pgId -
export const getPgById = async (req, res) => {
  const { pgId } = req.params;
  try {
    const foundPg = await pg.findById(pgId);
    
    if (!foundPg) {
      return res.status(404).json({ success: false, message: "PG not found" });
    }
    
    res.status(200).json({ success: true, data: foundPg });
  } catch (error) {
    console.log(`Error fetching PG by ID: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// This api is to get particular pg by adminId-
export const getParticularPg = async (req, res) => {
  try {
    const { id } = req.params;

    const pgAdmin = await admin.findById(id);

    if (!pgAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const actualPg = await pg.findById(pgAdmin.pgId);

    if (!actualPg) {
      return res.status(404).json({
        success: false,
        message: "PG not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: actualPg,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};