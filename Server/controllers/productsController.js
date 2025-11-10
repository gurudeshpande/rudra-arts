import Product from "../models/Products.js";
import cloudinary from "../cloudinaryConfig.js";
import streamifier from "streamifier";

// Optimized upload function with medium quality
const uploadToCloudinary = async (files) => {
  const streamUpload = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "Rudra-artss",
          quality: "auto:good",
          width: 1200,
          height: 1200,
          crop: "limit",
          fetch_format: "auto",
          dpr: "auto",
        },
        (error, result) => {
          if (result) resolve(result.secure_url);
          else reject(error);
        }
      );
      streamifier.createReadStream(fileBuffer).pipe(stream);
    });
  };

  return await Promise.all(files.map((file) => streamUpload(file.buffer)));
};

// Create Product with medium quality images
const createProduct = async (req, res) => {
  try {
    const { pname, pid, pprice, pdescription, psize, pcategory, pdiscount } =
      req.body;

    if (!req.files?.length) {
      return res.status(400).json({ error: "At least one image is required." });
    }

    const uploadedImageUrls = await uploadToCloudinary(req.files);

    const newProduct = new Product({
      product_name: pname,
      product_id: pid,
      product_price: pprice,
      product_image: uploadedImageUrls,
      product_description: pdescription,
      product_size: psize,
      product_category: pcategory,
      product_discount: pdiscount || 0,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", newProduct });
  } catch (err) {
    console.error("Product creation failed:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// Update Product with medium quality image replacements
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_name,
      product_price,
      product_description,
      product_size,
      product_category,
      product_image,
      product_discount,
      inStock,
    } = req.body;

    // Parse image array
    const imageArray = Array.isArray(product_image)
      ? product_image
      : JSON.parse(product_image || "[]");

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Process new uploads
    if (req.files?.length) {
      const uploadedImageUrls = await uploadToCloudinary(req.files);
      const imagePositions = req.body.imagePositions
        ? JSON.parse(req.body.imagePositions)
        : [];

      // Replace images at specified positions
      uploadedImageUrls.forEach((url, index) => {
        const position = imagePositions[index];
        if (position != null) {
          imageArray[position] = url;
        }
      });
    }

    // Final image array with existing images preserved where not replaced
    const finalImages = imageArray.map((img, index) =>
      img && img !== "null" ? img : existingProduct.product_image[index] || null
    );

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        product_name,
        product_price,
        product_description,
        product_size,
        product_category,
        product_image: finalImages,
        product_discount: product_discount || 0,
        inStock: inStock !== undefined ? inStock : true,
      },
      { new: true }
    );

    res.json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (err) {
    console.error("Product update failed:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export default { createProduct, updateProduct };
