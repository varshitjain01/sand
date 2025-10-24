import React from 'react';
import Hero from '../components/Layout/Hero'; // ✅ Make sure Hero is imported
import GenderCollectionSection from '../components/Products/GenderCollectionSection';
import NewArrivals from '../components/Products/NewArrivals';
import ProductDetails from '../components/Products/ProductDetails';
import ProductGrid from '../components/Products/ProductGrid';
import FeaturedCollection from '../components/Products/FeaturedCollection';
import { FeaturesSection } from '../components/Products/FeaturesSection';
import { fetchProductsByFilters } from "../redux/slices/productsSlice"; 
import { useDispatch } from 'react-redux';
import  { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";




const Home = () => {
const dispatch = useDispatch();
const { products, loading, error } = useSelector((state) => state.products);
const [bestSellerProduct, setBestSellerProduct] = useState(null);

useEffect(() => {
  // Fetch products for a specific collection
  dispatch(
    fetchProductsByFilters({
      gender: "Women",
      category: "Bottom Wear",
      limit: 8,
    })
  );
  // Fetch best seller product
const fetchBestSeller = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
    );
    setBestSellerProduct(response.data);
  } catch (error) {
    console.error(error);
  }
};
fetchBestSeller();
}, []);

  return (
    <div>
      {/* Hero Section */}
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/*Best sellers */}
      <h2 className="text-3xl text-center font-bold mb-4">Best Sellers</h2>
      {bestSellerProduct ? (
  <ProductDetails productId={bestSellerProduct._id} />
) : (
  <p className="text-center">Loading best seller product ...</p>
)}
      

      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">Top Wears for Women </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
      <FeaturedCollection/>
      <FeaturesSection/>
    </div>
  );
};

export default Home;
