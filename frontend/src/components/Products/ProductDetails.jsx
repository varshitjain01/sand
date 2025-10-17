import React, { useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'
import ProductGrid from './ProductGrid';

const selectedProduct = {
  name: "Stylish Jacket",
  price: 120,
  originalPrice: 150,
  description: "This is a Stylish Jacket perfect for any occasion",
  brand: "Stitch & Ditch",
  material: "Leather",
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: ["Black", "White", "Blue"],
  images: [
    {
      url: "https://picsum.photos/500/500?random=1",
      altText: "Stylish Jacket 1"
    },
    {
      url: "https://picsum.photos/500/500?random=2",
      altText: "Stylish Jacket 2"
    }
  ]
}

const ProductDetails = () => {
  const [mainImage, setmainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setisButtonDisabled] = useState(false);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setmainImage(selectedProduct.images[0].url);
    }
  }, []);

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select a size and color before adding to cart.", {
        duration: 1000,
      });
      return;
    }
    setisButtonDisabled(true);
    setTimeout(() =>{
toast.success("Item added to cart!", { duration: 1000 });
setisButtonDisabled(false);
    }, 500);
    
  };

  const similarProducts = [
    {
      _id:1,
      name:"Product 1",
      price:120,
      images :[
        {
          url:"https://picsum.photos/500/500?random=1"
        }
      ],
        },
        {
      _id:2,
      name:"Product 2",
      price:120,
      images :[
        {
          url:"https://picsum.photos/500/500?random=2"
        }
      ],
        },
        {
      _id:3,
      name:"Product 3",
      price:120,
      images :[
        {
          url:"https://picsum.photos/500/500?random=3"
        }
      ],
        },
        {
      _id:4,
      name:"Product 4",
      price:120,
      images :[
        {
          url:"https://picsum.photos/500/500?random=4"
        }
      ],
        },
  ];

  return (
    <div className="text-center p-6">
      <Toaster position="top-right" richColors />
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row">

          {/* Left Thumbnails */}
          <div className="hidden md:flex flex-col space-y-4 mr-6">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                onClick={() => setmainImage(image.url)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="md:w-1/2">
            <div className="mb-4">
              <img
                src={mainImage}
                alt="Main Product"
                className="rounded-lg w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Mobile Thumbnails */}
          <div className="md:hidden flex overflow-x-scroll space-x-4 mb-4">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                onClick={() => setmainImage(image.url)}
              />
            ))}
          </div>

          {/* Right Side */}
          <div className="md:w-1/2 md:ml-10 text-left">
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">{selectedProduct.name}</h1>
            <p className="text-lg text-gray-600 mb-1 line-through">
              {selectedProduct.originalPrice && `$${selectedProduct.originalPrice}`}
            </p>
            <p className="text-xl text-gray-800 mb-2">${selectedProduct.price}</p>
            <p className="mb-4 text-gray-500">{selectedProduct.description}</p>

            {/* Colors */}
            <div className="mb-4">
              <p className="text-gray-700">Color:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border ${selectedColor === color ? "border-4 border-black" : "border-gray-300"}`}
                    style={{
                      backgroundColor: color.toLowerCase(),
                      filter: "brightness(0.8)",
                    }}
                  ></button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-4">
              <p className="text-gray-700">Size:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded border ${selectedSize === size ? "bg-black text-white" : ""}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-gray-700">Quantity:</p>
              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="px-2 py-1 bg-gray-200 rounded text-lg"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="px-2 py-1 bg-gray-200 rounded text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={`bg-black text-white py-2 px-6 w-full mb-4 rounded-sm font-semibold ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-900"}`}
            >
             {isButtonDisabled ? "Adding..." : "ADD TO CART"}
            </button>

            {/* Characteristics */}
            <div className="mt-10 text-gray-700">
              <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
              <table className="w-full text-left text-sm text-gray-600">
                <tbody>
                  <tr>
                    <td className="py-1">Brand</td>
                    <td className="py-1">{selectedProduct.brand}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Material</td>
                    <td className="py-1">{selectedProduct.material}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
        <div className="mt-20">
          <h2 className="text-2xl text-center font-medium mb-4">You May Also Like</h2>
          <ProductGrid products={similarProducts}/>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
