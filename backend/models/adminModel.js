import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  phone_no: {
    type: Number,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "admin",
  },
  hasPg: {
    type: Boolean,
    enum: [true,false],
    default: false
  },
  pgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pg",
    default: null
  }
});

const admin = mongoose.model("admin", adminSchema);

export default admin;