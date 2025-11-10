import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    product_id: { type: String, required: true, unique: true },
    product_price: { type: Number, required: true },
    product_image: { type: [String], required: true },
    product_description: { type: String, required: true },
    product_size: { type: String, required: true },
    product_category: { type: String, required: true },
    product_discount: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
