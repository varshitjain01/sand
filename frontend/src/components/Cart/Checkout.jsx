import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaypalButton from './PaypalButton';

const Checkout = () => {
  const navigate = useNavigate();
  const [checkoutId, setCheckoutId] = useState(null);

  // 🏠 Shipping Address State
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // 🛒 Temporary cart data (replace with actual cart data later)
  const cart = {
    products: [
      {
        productId: 1,
        name: "T-Shirt",
        size: "M",
        color: "Red",
        quantity: 1,
        price: 1500,
        image: "https://picsum.photos/200?random=1",
      },
      {
        productId: 2,
        name: "Jeans",
        size: "L",
        color: "Blue",
        quantity: 1,
        price: 2000,
        image: "https://picsum.photos/200?random=2",
      },
    ],
    // Added totalPrice based on the image's usage of 'cart.totalPrice'
    totalPrice: 3500 // 1500 + 2000
  };

  // 💰 Calculate total amount
  const totalAmount = cart.products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  // 🧾 Checkout create handler
  const handleCreateCheckout = (e) => {
    e.preventDefault();
    setCheckoutId(Date.now()); // mock checkout ID
  };

  // 💸 Payment success
  const handlePaymentSuccess = (details) => {
    console.log("✅ Payment successful", details);
    navigate("/order-confirmation");
  };

  // Function to format price as a local string with the currency symbol
  const formatPrice = (price) => {
      // Assuming Indian Rupees (₹) for demonstration as per your previous code context
      return price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 });
  };


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
              value="test@gmail.com"
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
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                }
                value={shippingAddress.firstName}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                }
                value={shippingAddress.lastName}
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
                setShippingAddress({ ...shippingAddress, address: e.target.value })
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
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
                value={shippingAddress.city}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Postal Code</label>
              <input
                type="text"
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                }
                value={shippingAddress.postalCode}
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
                setShippingAddress({ ...shippingAddress, country: e.target.value })
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
                setShippingAddress({ ...shippingAddress, phone: e.target.value })
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
              <PaypalButton
                amount={totalAmount}
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
        
        {/* Product List Container */}
        <div className="divide-y border-b mb-4"> {/* Used border-b/divide-y for separation */}
          {cart.products.map((product, index) => (
            <div key={index} className="flex items-start justify-between py-3">
              {/* Product Image and Details Container */}
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover rounded mr-4"
                />
                
                {/* Product Name, Size, Color Details */}
                <div>
                  <h3 className="text-md font-medium text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-500">Size: {product.size}</p>
                  <p className="text-sm text-gray-500">Color: {product.color}</p>
                  <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                </div>
              </div>
              
              {/* Product Price */}
              <p className="text-xl font-semibold text-gray-700 whitespace-nowrap">
                  {formatPrice(product.price)}
              </p>
            </div>
          ))}
        </div>

        {/* Subtotal Section (Added from new image) */}
        <div className="flex justify-between items-center text-lg mb-4">
            <p>Subtotal</p>
            <p>{cart.totalPrice?.toLocaleString()}</p> 
            {/* Note: Used cart.totalPrice based on image, but typically this comes from calculated totalAmount */}
        </div>

        {/* Shipping Section (Added from new image) */}
        <div className="flex justify-between items-center text-lg">
            <p>Shipping</p>
            <p className="text-green-600 font-semibold">Free</p>
        </div>

        {/* Total Summary (Updated to reflect new structure) */}
        <div className="border-t mt-4 pt-4 flex justify-between text-xl font-bold">
          <p>Total:</p>
          <p>{cart.totalPrice?.toLocaleString()}</p> 
        </div>
      </div>
    </div>
  );
};

export default Checkout;