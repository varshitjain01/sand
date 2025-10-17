import React from 'react';
import { Outlet } from 'react-router-dom'; // ✅ Import Outlet
import Footer from "../Common/Footer";
import Header from "../Common/Header";

const UserLayout = () => {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main>
        <Outlet /> {/* Home and other nested pages will render here */}
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default UserLayout;
