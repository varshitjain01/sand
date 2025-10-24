import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from './components/Layout/UserLayout';
import Home from './pages/Home';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CollectionPage from './pages/CollectionPage';
import ProductDetails from './components/Products/ProductDetails';
import Checkout from './components/Cart/Checkout';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import MyOrdersPage from './pages/MyOrdersPage';
import { Provider } from "react-redux";
import store from "./redux/store";
import OrderDetailsPage from './pages/OrderDetailsPage';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />

        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='profile' element={<Profile />} />
            <Route path='collections/:collection' element={<CollectionPage />} />
            <Route path='product/:id' element={<ProductDetails />} />
            <Route path='checkout' element={<Checkout />} />
            <Route path='order-confirmation' element={<OrderConfirmationPage />} />
            <Route path='order/:id' element={<OrderDetailsPage />} />
            <Route path='my-orders' element={<MyOrdersPage />} /> {/* changed route to plural */}
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
