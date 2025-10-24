const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Helper: Find existing cart
const getCart = async (userId, guestId) => {
  if (userId) return await Cart.findOne({ user: userId });
  if (guestId) return await Cart.findOne({ guestId });
  return null;
};

// ✅ Add product to cart
router.post("/", async (req, res) => {
  try {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    // Validation
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    if (!size || !color) {
      return res.status(400).json({ message: "Please select size and color" });
    }

    const qty = Number(quantity) || 1;

    // Find product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Find or create cart
    let cart = await getCart(userId, guestId);
    if (!cart) {
      cart = new Cart({
        user: userId || undefined,
        guestId: guestId || `guest_${Date.now()}`,
        products: [],
        totalPrice: 0,
      });
    }

    // ✅ Find existing product in cart (same ID, size, color)
    const existingIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (existingIndex > -1) {
      cart.products[existingIndex].quantity += qty;
    } else {
      cart.products.push({
        productId,
        name: product.name,
        image: product.images?.[0]?.url || "",
        price: product.price,
        size,
        color,
        quantity: qty,
      });
    }

    // ✅ Update total price
    cart.totalPrice = cart.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    return res.status(200).json({
      message: "Product added to cart successfully",
      cart,
      guestId: cart.guestId, // send updated guestId back
    });
  } catch (error) {
    console.error("❌ Add to Cart Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Update quantity
router.put("/", async (req, res) => {
  try {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    let cart = await getCart(userId, guestId);

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (index > -1) {
      if (quantity > 0) {
        cart.products[index].quantity = Number(quantity);
      } else {
        cart.products.splice(index, 1);
      }

      cart.totalPrice = cart.products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("❌ Update Cart Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Remove item from cart
router.delete("/", async (req, res) => {
  try {
    const { productId, size, color, guestId, userId } = req.body;
    let cart = await getCart(userId, guestId);

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(
      (p) =>
        !(
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
        )
    );

    cart.totalPrice = cart.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.error("❌ Delete Cart Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get cart (user or guest)
router.get("/", async (req, res) => {
  try {
    const { userId, guestId } = req.query;
    const cart = await getCart(userId, guestId);

    if (!cart) {
      return res.status(200).json({
        message: "No cart found yet",
        cart: { products: [], totalPrice: 0 },
      });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error("❌ Get Cart Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Merge guest cart into user cart
router.post("/merge", protect, async (req, res) => {
  try {
    const { guestId } = req.body;
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });

    if (!guestCart) {
      return res.status(404).json({ message: "Guest cart not found" });
    }

    if (!userCart) {
      guestCart.user = req.user._id;
      guestCart.guestId = undefined;
      await guestCart.save();
      return res.status(200).json(guestCart);
    }

    // Merge products
    guestCart.products.forEach((item) => {
      const existing = userCart.products.findIndex(
        (p) =>
          p.productId.toString() === item.productId.toString() &&
          p.size === item.size &&
          p.color === item.color
      );

      if (existing > -1) {
        userCart.products[existing].quantity += item.quantity;
      } else {
        userCart.products.push(item);
      }
    });

    userCart.totalPrice = userCart.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await userCart.save();
    await Cart.findOneAndDelete({ guestId });

    return res.status(200).json(userCart);
  } catch (error) {
    console.error("❌ Merge Cart Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
