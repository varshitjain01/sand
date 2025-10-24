import React, { useState , useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // ✅ Added missing import
import login from "../assets/login.webp";
import { loginUser } from "../redux/slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { mergeCart } from "../redux/slices/cartSlices";




const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
const location = useLocation();
const { user, guestId } = useSelector((state) => state.auth);
const { cart } = useSelector((state) => state.cart);

// Get redirect parameter and check if it's checkout or something
const redirect = new URLSearchParams(location.search).get("redirect") || "/";
const isCheckoutRedirect = redirect.includes("checkout");

useEffect(() => {
  if (user) {
    if (cart?.products.length > 0 && guestId) {
     dispatch(mergeCart({ guestId, user }))
    .then(() => {
      navigate(isCheckoutRedirect ? "/checkout" : "/");
    });
} else {
  navigate(isCheckoutRedirect ? "/checkout" : "/");
}
}// Closing bracket for useEffect's callback function and the dependencies array:
}, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        {/* ✅ Fixed small typo: 'ction' → 'action' removed */}
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-lg p-8 border shadow-sm">
          <div className="justify-center flex mb-6">
            <h2 className="text-xl font-medium">Stitch & Ditch</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Hey there! 👋</h2>
          <p className="text-center mb-6">Enter your username and password to Login.</p>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-lg border"
              placeholder="Enter your email address"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded-lg border"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black rounded-lg font-semibold hover:bg-gray-800 transition text-white py-2"
          >
            Sign In
          </button>
          <p className="mt-6 text-center text-sm">
            Don’t have an account?
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500">
              {" "}
              Register
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img src={login} alt="Login to Account" className="h-[750px] w-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Login;
