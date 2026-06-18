import "dotenv/config";
// dotenv.config();
import express from "express";
import { connectDB } from "./config/db.js";
import { router } from "./routes/routes.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import "./config/cloudinary.js";

// dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload({ tempFileDir: "/tmp/", useTempFiles: true }));

connectDB();

app.get("/", (req, res) => {
  res.send("Hello this is the server start");
});

app.use("/api", router);

app.listen(3000, () => {
  console.log(`started at 3000`);
});
