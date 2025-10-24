const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

// Route imports
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscriberRoute = require("./routes/subscribeRoute");
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");

// Load environment variables
dotenv.config();

const app = express();

// Serve images statically
app.use("/images", express.static(path.join(__dirname, "images")));

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("WELCOME TO STITCH & DITCH API!");
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes); // ✅ Cart route
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", subscriberRoute);
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// Start server
const PORT = process.env.PORT || 9000; // ✅ Changed default to 9000 to match frontend
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
