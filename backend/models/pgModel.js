import mongoose, { Schema } from "mongoose";

const pgSchema = new Schema({
  pgName: {
    type: String,
    required: true,
  },
  pgLocation: {
    type: String,
    required: true,
  },
  pgRent: {
    type: Number,
    required: true,
  },
  pgSharing: {
    type: Number,
    required: true,
  },
  pgGender: {
    type: String,
    required: true,
    enum: ["Gents", "Ladies"],
  },
  description: {
    type: String,
    required: true,
  },
  facilities: {
    type: [String],
    required: true,
  },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    }
  ],
  pgAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
    unique: true
  },
});

const pg = mongoose.model("pg", pgSchema);

export default pg;
