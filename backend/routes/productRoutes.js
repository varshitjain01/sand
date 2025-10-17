const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

// ✅ @desc   Create a new product
// ✅ @route  POST /api/products
// ✅ @access Private (Admin)
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("❌ Error creating product:", error.message);
    res.status(500).json({ message: "Server error while creating product", error: error.message });
  }
});

// ✅ @desc   Get all products with optional query filters and search
// ✅ @route  GET /api/products
// ✅ @access Public
router.get("/", async (req, res) => {
  try {
    const { collection, size, color,gender, minPrice, maxPrice,sortBy,search,category,material,brand,limit, isFeatured, isPublished } = req.query;

    let query = {};

    // Keyword search (name or category)
    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collections = collection;
    }
    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category;
    }

    if(material){
      query.material = {$in: material.split(",")};

    }
     if(brand){
      query.brand = {$in: brand.split(",")};
      
    }

    if(size){
      query.sizes = {$in: size.split(",")};
      
    }
    if(color){
      query.brand = {$in: brand.split(",")};
      
    }
     if(size){
      query.sizes = {$in: size.split(",")};brand
       [
        { name: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";
    if (isPublished !== undefined) filter.isPublished = isPublished === "true";

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// ✅ @desc   Get featured products
// ✅ @route  GET /api/products/featured/list
// ✅ @access Public
router.get("/featured/list", async (req, res) => {
  try {
    const featured = await Product.find({ isFeatured: true });
    res.json(featured);
  } catch (error) {
    console.error("❌ Error fetching featured products:", error.message);
    res.status(500).json({ message: "Failed to fetch featured products" });
  }
});

// ✅ @desc   Get a single product by ID
// ✅ @route  GET /api/products/:id
// ✅ @access Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("❌ Error fetching product:", error.message);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

// ✅ @desc   Update a product
// ✅ @route  PUT /api/products/:id
// ✅ @access Private (Admin)
router.put("/:id", protect, admin, async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    countInStock,
    category,
    brand,
    sizes,
    colors,
    collections,
    material,
    gender,
    images,
    isFeatured,
    isPublished,
    tags,
    dimensions,
    weight,
    sku,
  } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;
      product.sku = sku || product.sku;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("❌ Error updating product:", error.message);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// ✅ @desc   Delete a product
// ✅ @route  DELETE /api/products/:id
// ✅ @access Private (Admin)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
