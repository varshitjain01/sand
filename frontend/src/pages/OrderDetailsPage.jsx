import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import { useDispatch, useSelector } from "react-redux";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Safe selector: fallback to empty object if state.orders is undefined
  const ordersState = useSelector((state) => state.orders || {});
  const { orderDetails, loading, error } = ordersState;

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  const {
    _id,
    orderItems = [],
    isPaid,
    paymentMethod,
    shippingAddress = {},
    shippingMethod = "Standard",
    isDelivered = false,
    createdAt,
  } = orderDetails || {};

  const formatPrice = (price) => `$${price?.toFixed(2) || "0.00"}`;
  const calculateTotal = (items) =>
    items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString() +
      " " +
      new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xl font-semibold text-gray-800">
              Order ID: <span className="font-normal text-gray-600">{_id}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <span className="inline-block px-3 py-1 text-xs font-semibold leading-none rounded-full text-green-700 bg-green-100">
              {isPaid ? "Approved" : "Pending Payment"}
            </span>

            <span className="inline-block px-3 py-1 text-xs font-semibold leading-none rounded-full text-yellow-700 bg-yellow-100">
              {isDelivered ? "Delivered" : "Pending Delivery"}
            </span>
          </div>
        </div>

        <hr className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Payment Info</h3>
            <p className="text-sm text-gray-700">Method: {paymentMethod}</p>
            <p className="text-sm text-gray-700">Status: {isPaid ? "Paid" : "Pending"}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Shipping Info</h3>
            <p className="text-sm text-gray-700">Method: {shippingMethod}</p>
            <p className="text-sm text-gray-700">
              Address: {shippingAddress.city}, {shippingAddress.country}
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">Products</h3>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orderItems.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-sm object-cover mr-4"
                      src={item.image}
                      alt={item.name}
                    />
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatPrice(item.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Link
          to="/my-orders"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          &larr; Back to My Orders
        </Link>
        <div className="text-xl font-bold text-gray-900">
          Grand Total: {formatPrice(calculateTotal(orderItems))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
