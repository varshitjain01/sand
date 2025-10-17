import React from 'react'
import heroImg from "../../assets/rabbit-hero.webp"
import { Link } from "react-router-dom";


const Hero = () => {
  return (
    <section className="relative">
        <img src={heroImg} alt="Rabbit" className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover" />
        <div className="absolute inset-0 bg-opacity-5 bg-black flex items-center justify-center">
          <div className="text-center text-white p-6">
            <h1 className="text-4xl md:text-9xl  font-bold tracking-tighter uppercase mb-4">
             Supreme <br /> Collection
            </h1>
            <p className="text-sm tracking-tighter md:text-lg mb-6">
              Explore our Collection with fast world wide shipping.
            </p>
          <Link to="#" className="bg-white text-gray-950 py-2 px-6 font-semibold text-lg">Shop now</Link>
          </div>
        </div>
    </section>
  )
}

export default Hero