import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  const toggleCartDrawer = () => setDrawerOpen(!drawerOpen);
  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);

  return (
    <>
      {/* Main Navbar */}
      <nav className="mx-auto container flex items-center justify-between py-4 px-6">
        {/* Left: Logo */}
        <div>
          <Link to="/" className="text-2xl font-medium">
            Stitch&Ditch
          </Link>
        </div>

        {/* Center: Menu (hidden on mobile) */}
        <div className="hidden md:flex space-x-6">
          <Link to="collections/all" className="text-gray-700 hover:text-black text-sm font-medium uppercase">
            Men
          </Link>
          <Link to="#" className="text-gray-700 hover:text-black text-sm font-medium uppercase">
            Women
          </Link>
          <Link to="#" className="text-gray-700 hover:text-black text-sm font-medium uppercase">
            Top Wear
          </Link>
          <Link to="#" className="text-gray-700 hover:text-black text-sm font-medium uppercase">
            Bottom Wear
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-4">
          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>

          <button onClick={toggleCartDrawer} className="relative hover:text-black">
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            <span className="absolute -top-1 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
              4
            </span>
          </button>

          <div className="overflow-hidden">
            <SearchBar />
          </div>

          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiBars3BottomRight className="text-gray-700 h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile Nav Drawer */}
      {navDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={toggleNavDrawer}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col space-y-4 px-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="flex flex-col space-y-3">
            <Link to="/collections/all" onClick={toggleNavDrawer} className="block text-gray-700 font-medium hover:text-black">
              Men
            </Link>
            <Link to="#" onClick={toggleNavDrawer} className="block text-gray-700 font-medium hover:text-black">
              Women
            </Link>
            <Link to="#" onClick={toggleNavDrawer} className="block text-gray-700 font-medium hover:text-black">
              Top Wear
            </Link>
            <Link to="#" onClick={toggleNavDrawer} className="block text-gray-700 font-medium hover:text-black">
              Bottom Wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
