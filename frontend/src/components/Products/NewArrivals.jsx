import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  // State to track if the mouse moved enough to be considered a drag
  const [dragMoved, setDragMoved] = useState(false); 
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const newArrivals = [
    { _id: 1, name: "Jacket", price: 120, images: [{ url: "https://picsum.photos/500/500?random=1", altText: "Jacket" }] },
    { _id: 2, name: "Jacket", price: 120, images: [{ url: "https://picsum.photos/500/500?random=2", altText: "Jacket" }] },
    { _id: 3, name: "Jacket", price: 120, images: [{ url: "https://picsum.photos/500/500?random=3", altText: "Jacket" }] },
    { _id: 4, name: "Jacket", price: 120, images: [{ url: "https://picsum.photos/500/500?random=4", altText: "Jacket" }] },
    { _id: 5, name: "Jacket", price: 120, images: [{ url: "https://picsum.photos/500/500?random=5", altText: "Jacket" }] },
    { _id: 6, name: "Jacket", price: 120, images: [{ url: "https://picsum.photos/500/500?random=6", altText: "Jacket" }] },
    { _id: 7, name: "Jacket", price: 120, images: [{ url: "https://picsum.photos/500/500?random=7", altText: "Jacket" }] },
    { _id: 8, name: "Jacket", price: 120, images: [{ url: "https://picsum.photos/500/500?random=8", altText: "Jacket" }] },
    { _id: 9, name: "Jacket", price: 120, images: [{ url: "https://picsum.photos/500/500?random=9", altText: "Jacket" }] },
  ];

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (!container) return;
    const atStart = container.scrollLeft <= 0;
    // Check if scrollLeft + clientWidth is greater than or equal to scrollWidth
    const atEnd = Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth; 
    setCanScrollLeft(!atStart);
    setCanScrollRight(!atEnd);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    // Reset dragMoved at the start of every click/drag
    setDragMoved(false); 
    const container = scrollRef.current;
    setStartX(e.pageX - container.offsetLeft);
    setScrollStart(container.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);

  const handleMouseUp = (e) => {
    if (dragMoved) {
      // Prevent the default browser click behavior if a drag occurred
      e.preventDefault(); 
    }
    // **********************************************
    // FIX: Reset dragMoved so the next genuine click works
    // **********************************************
    setDragMoved(false); 
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = scrollRef.current;
    const x = e.pageX - container.offsetLeft;
    const walk = x - startX;
    // Detect drag movement with a small threshold (e.g., 5 pixels)
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
  }, []);

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
            onClick={() => scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })}
          >
            <FiChevronLeft className="text-2xl rounded" />
          </button>
          <button
            disabled={!canScrollRight}
            className="p-2 rounded border bg-white text-black disabled:opacity-40"
            onClick={() => scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })}
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
                // block navigation when dragging is detected upon mouse up
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