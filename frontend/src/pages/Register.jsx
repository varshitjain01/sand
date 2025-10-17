import React, { useState } from 'react'
import {Link }  from 'react-router-dom';
import register from "../assets/register.webp"

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("User registered: ",{name , email, password});
    }

  return (
    <div className="flex">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center  p-8 md:p-12">
        <form onSubmit={handleSubmit} action="" className="w-full max-w-md bg-white rounded-lg p-8 border shadow-sm">
            <div className="justify-center flex mb-6 ">
                <h2 className="text-xl font-medium ">Stitch & Ditch</h2>
            </div>
            <h2 className="text-2xl font-bold text-center mb-6">Hey there! 👋</h2>
            <p className="text-center mb-6 "> Enter your username and password to Register. </p>
            <div className="mb-4 ">
              <label htmlFor="" className="block text-sm font-semibold mb-2">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 rounded-lg border" placeholder="Enter your name" required/>
            </div>
            <div className="mb-4 ">
              <label htmlFor="" className="block text-sm font-semibold mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded-lg border" placeholder="Enter your email address" required/>
            </div>
            <div className="mb-4">
                <label htmlFor="" className="block text-sm font-semibold mb-2">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 rounded-lg border" placeholder="Enter your password" required/>
            </div>
            <button type="submit" className="w-full bg-black rounded-lg font-semibold hover:bg-gray-800 transition text-white py-2">Sign Up</button>
            <p className="mt-6 text-center text-sm">
                Have an account?
                <Link to="/Login" className="text-blue-500"> Login</Link>
            </p>
            
        </form>
        </div>
        <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center ">
            <img src={register} alt="Login to Account" className="h-[750px] w-full object-cover" />
        </div>
        </div>
    </div>
  )
}

export default Register;