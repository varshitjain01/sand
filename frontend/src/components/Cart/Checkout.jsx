import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { createCheckout } from "../../redux/slices/checkoutSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart?.products?.length) {
      navigate("/");
    }
  }, [cart, navigate]);

  // ✅ Use product prices directly (assume already in USD)
  const totalAmount =
    cart?.products?.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    ) || 0;

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (cart?.products?.length > 0) {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: "PayPal",
          totalPrice: totalAmount,
        })
      );

      if (res.payload?._id) setCheckoutId(res.payload._id);
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus: "paid", paymentDetails: details },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      await handleFinalizeCheckout(checkoutId);
    } catch (error) {
      console.error("Payment success error:", error);
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Finalize checkout error:", error);
    }
  };

  // ✅ Format price in USD for display
  const formatPrice = (price) =>
    price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart?.products?.length) return <p>Your cart is empty</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* LEFT SECTION - Checkout Form */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold uppercase mb-6">Checkout</h2>

        <form onSubmit={handleCreateCheckout}>
          {/* Contact Details */}
          <h3 className="text-lg mb-4 font-semibold">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              className="w-full p-2 border rounded bg-gray-100"
              disabled
            />
          </div>

          {/* Delivery Details */}
          <h3 className="text-lg mb-4 font-semibold">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Country</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Payment */}
          {!checkoutId ? (
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
            >
              Continue to Payment
            </button>
          ) : (
            <div className="mt-6">
              <h3 className="text-lg mb-4 font-semibold">Pay with PayPal</h3>
              <PayPalButton
                amount={totalAmount} // ✅ Use product.js price in USD directly
                onSuccess={handlePaymentSuccess}
                onError={() => alert("Payment failed. Try again.")}
              />
            </div>
          )}
        </form>
      </div>

      {/* RIGHT SECTION - Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

        <div className="divide-y border-b mb-4">
          {cart.products.map((product) => (
            <div
              key={product.productId}
              className="flex items-start justify-between py-3"
            >
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover rounded mr-4"
                />
                <div>
                  <h3 className="text-md font-medium text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">Size: {product.size}</p>
                  <p className="text-sm text-gray-500">Color: {product.color}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {product.quantity}
                  </p>
                </div>
              </div>
              <p className="text-xl font-semibold text-gray-700 whitespace-nowrap">
                ${product.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>${totalAmount.toFixed(2)}</p>
        </div>

        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p className="text-green-600 font-semibold">Free</p>
        </div>

        <div className="border-t mt-4 pt-4 flex justify-between text-xl font-bold">
          <p>Total:</p>
          <p>${totalAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
