import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNewArrivals(); // ✅ function is *called*, not just referenced
  }, []);

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMoved, setDragMoved] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (!container) return;
    const atStart = container.scrollLeft <= 0;
    const atEnd =
      Math.ceil(container.scrollLeft + container.clientWidth) >=
      container.scrollWidth;
    setCanScrollLeft(!atStart);
    setCanScrollRight(!atEnd);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragMoved(false);
    const container = scrollRef.current;
    setStartX(e.pageX - container.offsetLeft);
    setScrollStart(container.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);

  const handleMouseUp = (e) => {
    if (dragMoved) e.preventDefault();
    setDragMoved(false);
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = scrollRef.current;
    const x = e.pageX - container.offsetLeft;
    const walk = x - startX;
    if (Math.abs(walk) > 5) setDragMoved(true);
    container.scrollLeft = scrollStart - walk;
    updateScrollButtons();
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
    }
    return () => {
      if (container) container.removeEventListener("scroll", updateScrollButtons);
    };
  }, [newArrivals]);

  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover the newest trends crafted to elevate your everyday vibe.
        </p>

        <div className="absolute right-0 bottom-[-30px] flex space-x-2">
          <button
            disabled={!canScrollLeft}
            className="p-2 rounded border bg-white text-black disabled:opacity-40"
            onClick={() =>
              scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })
            }
          >
            <FiChevronLeft className="text-2xl rounded" />
          </button>
          <button
            disabled={!canScrollRight}
            className="p-2 rounded border bg-white text-black disabled:opacity-40"
            onClick={() =>
              scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
            }
          >
            <FiChevronRight className="text-2xl rounded" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative no-scrollbar ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative select-none"
          >
            <Link
              to={`/product/${product._id}`}
              onClick={(e) => {
                if (dragMoved) e.preventDefault();
              }}
            >
              <img
                src={product.images[0]?.url}
                alt={product.images[0]?.altText || product.name}
                className="w-full h-[500px] object-cover rounded-lg"
              />
              <div className="absolute right-0 left-0 bottom-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg">
                <h4 className="font-medium">{product.name}</h4>
                <p className="mt-1">${product.price}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
