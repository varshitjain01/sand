const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const products = require("./data/products"); // array of product objects

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

const seedData = async () => {
  try {
    // 1️⃣ Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();


    // 2️⃣ Create default admin user
    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456", // make sure your User model hashes this if required
      role: "admin",       // or isAdmin: true if your schema uses that
    });
    console.log("Admin user created");

    const userID = createdUser._id;

    // 3️⃣ Insert products and associate with admin user
    const sampleProducts = products.map((product) => {
      return { ...product, user: userID };
    });

    await Product.insertMany(sampleProducts);
    console.log("Products seeded successfully");

    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();

