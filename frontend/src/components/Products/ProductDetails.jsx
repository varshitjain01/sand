import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlices";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  // ✅ Fetch product details
  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  // ✅ Set default image when product loads
  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  // ✅ Quantity Controls
  const handleQuantityChange = (action) => {
    setQuantity((prev) => {
      if (action === "plus") return prev + 1;
      if (action === "minus" && prev > 1) return prev - 1;
      return prev;
    });
  };

  // ✅ Add to Cart Handler
  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select a size and color before adding to cart.", {
        duration: 1000,
      });
      return;
    }

    setIsButtonDisabled(true);

    const payload = {
      productId: selectedProduct._id,
      name: selectedProduct.name,
      image: selectedProduct.images?.[0]?.url || "",
      price: selectedProduct.price,
      size: selectedSize,
      color: selectedColor,
      quantity,
      guestId,
      userId: user?._id,
    };

    console.log("🟡 Sending Add to Cart payload:", payload);

    dispatch(addToCart(payload))
      .unwrap()
      .then(() => {
        toast.success("Product added to cart!", { duration: 1000 });
      })
      .catch((err) => {
        console.error("❌ Add to cart error:", err);
        toast.error(err?.message || "Failed to add product to cart", {
          duration: 1000,
        });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="text-center p-6">
      {selectedProduct && (
        <>
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
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                      mainImage === image.url
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(image.url)}
                  />
                ))}
              </div>

              {/* Main Image */}
              <div className="md:w-1/2 mb-4 md:mb-0">
                <img
                  src={mainImage}
                  alt="Main Product"
                  className="rounded-lg w-full h-auto object-cover"
                />
              </div>

              {/* Mobile Thumbnails */}
              <div className="md:hidden flex overflow-x-scroll space-x-4 mb-4">
                {selectedProduct.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.altText || `Thumbnail ${index}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                      mainImage === image.url
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(image.url)}
                  />
                ))}
              </div>

              {/* Right Side */}
              <div className="md:w-1/2 md:ml-10 text-left">
                <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                  {selectedProduct.name}
                </h1>
                {selectedProduct.originalPrice && (
                  <p className="text-lg text-gray-600 mb-1 line-through">
                    ${selectedProduct.originalPrice}
                  </p>
                )}
                <p className="text-xl text-gray-800 mb-2">
                  ${selectedProduct.price}
                </p>
                <p className="mb-4 text-gray-500">
                  {selectedProduct.description}
                </p>

                {/* Colors */}
                <div className="mb-4">
                  <p className="text-gray-700">Color:</p>
                  <div className="flex gap-2 mt-2">
                    {selectedProduct.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border ${
                          selectedColor === color
                            ? "border-4 border-black"
                            : "border-gray-300"
                        }`}
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
                        className={`px-4 py-2 rounded border ${
                          selectedSize === size
                            ? "bg-black text-white"
                            : "border-gray-300"
                        }`}
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
                  className={`bg-black text-white py-2 px-6 w-full mb-4 rounded-sm font-semibold ${
                    isButtonDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-900"
                  }`}
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

            {/* Similar Products */}
            <div className="mt-20">
              <h2 className="text-2xl text-center font-medium mb-4">
                You May Also Like
              </h2>
              <ProductGrid
                products={similarProducts}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;
