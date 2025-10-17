import React from 'react';
import {RiDeleteBin3Line} from "react-icons/ri"

const CartContents = () => {
  const cartProducts = [
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
  ];

  return (
    <div className="p-4">
      {cartProducts.map((product, index) => (
        <div
          key={index}
          className="flex items-start justify-between py-4 border-b"
        >
          {/* Product Image */}
          <div className="flex items-start space-x-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 rounded-md object-cover"
            />

            {/* Product Info */}
            <div>
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-500">
                Size: {product.size} | Color: {product.color}
              </p>
              <div className="flex items-center mt-2">
<button className="border rounded px-2 py-1 text-xl font-medium">-</button>
<span className="mx-4">{product.quantity}</span>
<button className="border rounded px-2 py-1 text-xl font-medium">+</button>
              </div>
            </div>
          </div>
<div>
  <p>
    ${product.price.toLocaleString()}
  </p>
  <button>
    <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600"/>
  </button>
</div>
         
          
        </div>
      ))}
    </div>
  );
};

export default CartContents;
