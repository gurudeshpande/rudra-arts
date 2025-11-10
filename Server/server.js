// server.js
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// Routes
import adminRoutes from "./routes/admin.js";
import productRoutes from "./routes/products.js";
import newsRoutes from "./routes/news.js";
import blogRoutes from "./routes/blog.js";
import checkoutRoutes from "./routes/checkoutRoute.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://www.rudraartsandhandicrafts.in", // your production frontend
  "https://rudraartsandhandicrafts.in", // your production frontend
  "http://localhost:5173", // your local frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB connection

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend static files
app.use(express.static(path.join(__dirname, "dist")));

// Catch-all to serve index.html for React Router
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// Use Routes
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/checkout", checkoutRoutes);

app.get("/", (req, res) => {
  res.send("Rudra Arts API running with MongoDB");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
