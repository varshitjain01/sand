import React from 'react'
import Topbar from '../Layout/Topbar'
import Navbar from './Navbar'
import CartDrawer from '../Layout/CartDrawer'

const Header = () => {
  return (
    <header className="border-b border-gray-200">
      <marquee>Shop Now!</marquee>
        {/* Topbar */}
        <Topbar />
        {/* Navbar */}
        <Navbar />
        {/* Cart Drawer */}
        <CartDrawer/>
    </header>
  )
}

export default Header