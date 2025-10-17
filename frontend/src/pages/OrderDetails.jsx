import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderDetails = () => {
    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);

    // --- Helper function to calculate total ---
    const calculateTotal = (items) => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    // --- Helper function to format price (as seen in image $XX.XX) ---
    const formatPrice = (price) => {
        // Simple fixed decimal formatting to match the image style ($34.99)
        return `$${price.toFixed(2)}`;
    };

    // --- Mock Data Fetching (Matches your existing logic + added fields for UI) ---
    useEffect(() => {
        const mockOrderDetails = {
            _id: id || "#67540ced3376121b361a0ed0", // Use the mock ID from the image if 'id' is undefined
            createdAt: new Date("2024-07-12"), // Use a fixed date to match the image date (07/12/2024)
            isPaid: true,
            isDelivered: false, // Used for 'Pending Delivery' status
            paymentMethod: "PayPal",
            shippingMethod: "Standard",
            shippingAddress: { city: "New York", country: "USA" },
            orderItems: [
                {
                    productId: "1",
                    name: "Slim-Fit Easy-Iron Shirt", // Updated name to match image
                    price: 34.99, // Updated price
                    quantity: 1,
                    image: "https://picsum.photos/150?random=1",
                },
                {
                    productId: "2",
                    name: "Classic Oxford Button-Down Shirt", // Updated name
                    price: 39.99, // Updated price
                    quantity: 1,
                    image: "https://picsum.photos/150?random=2",
                },
                {
                    productId: "3",
                    name: "Slim-Fit Easy-Iron Shirt",
                    price: 34.99,
                    quantity: 1,
                    image: "https://picsum.photos/150?random=3",
                },
                {
                    productId: "4",
                    name: "Slim-Fit Easy-Iron Shirt",
                    price: 34.99,
                    quantity: 1,
                    image: "https://picsum.photos/150?random=4",
                },
                {
                    productId: "5",
                    name: "Chino Pants",
                    price: 55.00,
                    quantity: 1,
                    image: "https://picsum.photos/150?random=5",
                },
            ],
        };
        setOrderDetails(mockOrderDetails);
    }, [id]);

    if (!orderDetails) {
        return <div className="max-w-7xl mx-auto p-4 sm:p-6">Loading order details...</div>;
    }

    const { _id, createdAt, isPaid, isDelivered, paymentMethod, shippingMethod, shippingAddress, orderItems } = orderDetails;

    // Format date as MM/DD/YYYY
    const formattedDate = createdAt.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    });

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>

            {/* --- Order Header Section (ID, Date, Status) --- */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xl font-semibold text-gray-800">
                            Order ID: <span className="font-normal text-gray-600">{_id}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-col items-end space-y-2">
                        {/* Approved/Paid Status */}
                        <span className="inline-block px-3 py-1 text-xs font-semibold leading-none rounded-full text-green-700 bg-green-100">
                            Approved
                        </span>

                        {/* Delivery Status */}
                        <span className="inline-block px-3 py-1 text-xs font-semibold leading-none rounded-full text-yellow-700 bg-yellow-100">
                            {isDelivered ? "Delivered" : "Pending Delivery"}
                        </span>
                    </div>
                </div>
                
                <hr className="my-6" />

                {/* --- Payment & Shipping Info --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Payment Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Payment Info</h3>
                        <p className="text-sm text-gray-700">Payment Method: {paymentMethod}</p>
                        <p className="text-sm text-gray-700">Status: {isPaid ? "Paid" : "Pending"}</p>
                    </div>

                    {/* Shipping Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Shipping Info</h3>
                        <p className="text-sm text-gray-700">Shipping Method: {shippingMethod}</p>
                        <p className="text-sm text-gray-700">Address: {shippingAddress.city}, {shippingAddress.country}</p>
                    </div>
                </div>
            </div>

            {/* --- Products Table --- */}
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
            
            {/* --- Final Total and Back Button --- */}
            <div className="flex justify-between items-center mt-6">
                <Link to="/my-orders" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    &larr; Back to My Orders
                </Link>
                <div className="text-xl font-bold text-gray-900">
                    Grand Total: {formatPrice(calculateTotal(orderItems))}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;