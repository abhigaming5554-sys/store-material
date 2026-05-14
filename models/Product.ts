import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    enum: ["video", "xml", "font"],
    required: true,
  },

  thumbnail: {
    type: String,
  },

  // Download file after payment
  fileUrl: {
    type: String,
  },

  // Product preview video
  previewVideo: {
    type: String,
  },

  // Direct secure download link
  downloadLink: {
    type: String,
  },

  rating: {
    type: Number,
    default: 5,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

export default
  mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);