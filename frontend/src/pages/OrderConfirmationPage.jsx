import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlices";


const OrderConfirmationPage = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { checkout } = useSelector((state) => state.checkout);

// Clear the cart when the order is confirmed
useEffect(() => {
  if (checkout && checkout._id) {
    dispatch(clearCart());
    localStorage.removeItem("cart");
  } else {
    navigate("/my-orders");
  }
}, [checkout, dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for Your Order!
      </h1>

      {checkout && (
        <div className="p-6 rounded-lg border">
          {/* Order Info */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-lg font-semibold">
                Order ID: {checkout._id}
              </h2>
              <p className="text-gray-500">
                Order Date:{" "}
                {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-500">
                Shipping to: {checkout.shippingAddress.address},{" "}
                {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}
              </p>
            </div>

            <p className="text-emerald-700 text-sm font-medium">
              Estimated Delivery: {calculateEstimatedDelivery(checkout.createdAt)}
            </p>
          </div>

          {/* Order Items */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            {checkout.checkoutItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                       {item.size} |  {item.color}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-medium">${item.price}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
                <h4  className="text-lg font-semibold mb-2">Payment</h4>
                <p className="text-gray-600">PayPal</p>
            </div>
            <div>
                <h4 className="font-semibold text-lg mb-2 ">Delivery</h4>
                <p className="text-gray-600 ">{checkout.shippingAddress.address}</p>
                <p className="text-gray-600">{checkout.shippingAddress.city} , {""} {checkout.shippingAddress.country}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
