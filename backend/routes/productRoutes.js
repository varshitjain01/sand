const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

// Create a new product
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name, description, price, discountPrice, countInStock, category, brand,
      sizes, colors, collections, material, gender, images, isFeatured, isPublished,
      tags, dimensions, weight, sku
    } = req.body;

    const product = new Product({
      name, description, price, discountPrice, countInStock, category, brand,
      sizes, colors, collections, material, gender, images, isFeatured, isPublished,
      tags, dimensions, weight, sku, user: req.user._id
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("❌ Error creating product:", error.message);
    res.status(500).json({ message: "Server error while creating product", error: error.message });
  }
});

// Get all products with filters/search
router.get("/", async (req, res) => {
  try {
    const {
      collection, size, color, gender, minPrice, maxPrice, sortBy, search,
      category, material, brand, limit, isFeatured, isPublished
    } = req.query;

    const query = {};

    if (collection && collection.toLowerCase() !== "all") query.collections = collection;
    if (category && category.toLowerCase() !== "all") query.category = category;

    if (material && material.trim() !== "") query.material = { $in: material.split(",") };
    if (brand && brand.trim() !== "") query.brand = { $in: brand.split(",") };
    if (size && size.trim() !== "") query.sizes = { $in: size.split(",") };
    if (color && color.trim() !== "") query.colors = color;

    if (gender && gender.trim() !== "") query.gender = gender;
    if (isFeatured !== undefined) query.isFeatured = isFeatured === "true";
    if (isPublished !== undefined) query.isPublished = isPublished === "true";

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search && search.trim() !== "") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    let sort = { createdAt: -1 };
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc": sort = { price: 1 }; break;
        case "priceDesc": sort = { price: -1 }; break;
        case "popularity": sort = { rating: -1 }; break;
      }
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);

    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error.message);
    res.status(500).send("Server Error");
  }
});

// Get best seller
router.get("/best-seller", async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1 });
    if (bestSeller) res.json(bestSeller);
    else res.status(404).json({ message: "No best seller found" });
  } catch (error) {
    console.error("❌ Error fetching best seller:", error.message);
    res.status(500).send("Server Error");
  }
});

// Get new arrivals
router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json(newArrivals);
  } catch (error) {
    console.error("❌ Error fetching new arrivals:", error.message);
    res.status(500).send("Server Error");
  }
});

// Get featured products
router.get("/featured/list", async (req, res) => {
  try {
    const featured = await Product.find({ isFeatured: true });
    res.json(featured);
  } catch (error) {
    console.error("❌ Error fetching featured products:", error.message);
    res.status(500).json({ message: "Failed to fetch featured products" });
  }
});

// Get similar products
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const similarProducts = await Product.find({
      _id: { $ne: id },
      gender: product.gender,
      category: product.category
    }).limit(4);

    res.json(similarProducts);
  } catch (error) {
    console.error("❌ Error fetching similar products:", error.message);
    res.status(500).send("Server Error");
  }
});

// Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: "Product not found" });
  } catch (error) {
    console.error("❌ Error fetching product:", error.message);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

// Update product
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("❌ Error updating product:", error.message);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// Delete product
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    console.error("❌ Error deleting product:", error.message);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

module.exports = router;
