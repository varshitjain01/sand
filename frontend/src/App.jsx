import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from './components/Layout/UserLayout';
import Home from './pages/Home';
import { Toaster, toast } from 'sonner'
import Login from './pages/Login';
import Register from './pages/Register';
import { Profile } from './pages/Profile';
import CollectionPage from './pages/CollectionPage';
import ProductDetails from './components/Products/ProductDetails';
import Checkout from './components/Cart/Checkout';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderDetails from './pages/OrderDetails';
import MyOrdersPage from './pages/MyOrdersPage';


const App = () => {
  return (
    <BrowserRouter>
    <Toaster position="top-right" />
    
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path='login' element={<Login/>}/>
          <Route path='register' element={<Register/>}/>
          <Route path='profile' element={<Profile/>}/>
          <Route path='collections/:collection' element={<CollectionPage/>}/>
          <Route path='product/:id' element={<ProductDetails/>} />
          <Route path='checkout' element={<Checkout/>} />
          <Route path='order-confirmation' element={<OrderConfirmationPage/>}/>
          <Route path='order/:id' element={<OrderDetails/>}/>
          <Route path='my-orders' element={<MyOrdersPage/>}/>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
