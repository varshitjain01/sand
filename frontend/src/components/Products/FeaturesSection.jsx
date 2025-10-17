import React from 'react'
import { HiArrowPathRoundedSquare, HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi2'

export const FeaturesSection = () => {
  return (
    
    <section className="py-16 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
         {/** feature 1 */}
         <div className="flex flex-col items-center">
            <div className="p-4 rounded-full mb-4 ">
                <HiShoppingBag className="text-xl "/>

            </div>
            <h4 className="tracking-tighter mb-2 uppercase font-semibold" >free international shipping</h4>
            <p className="text-gray-600 text-sm tracking-tighter">On all orders over $100.00</p>
         </div>
         {/** feature 2 */}
         <div className="flex flex-col items-center">
            <div className="p-4 rounded-full mb-4 ">
                <HiArrowPathRoundedSquare className="text-xl "/>

            </div>
            <h4 className="tracking-tighter mb-2 uppercase font-semibold" >7 days return</h4>
            <p className="text-gray-600 text-sm tracking-tighter">Money back guarantee</p>
         </div>
         {/** feature 3 */}
         <div className="flex flex-col items-center">
            <div className="p-4 rounded-full mb-4 ">
                <HiOutlineCreditCard className="text-xl "/>

            </div>
            <h4 className="tracking-tighter mb-2 uppercase font-semibold" >secure checkout</h4>
            <p className="text-gray-600 text-sm tracking-tighter">100% secured checkout process</p>
         </div>
















        </div>
    </section>
  )
}