const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Gallery", gallerySchema);
