import React from 'react'
import { Link } from 'react-router-dom';
import logo from "../../assets/logo.png";

const Footer = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

                <div className='ml-8'>
                    <img src={logo} className='mb-5 w-32' alt="logo" />
                    <p className='w-full md:w-2/3 text-gray-600'>
                        Your style, your statement. Forever offers trendy fashion and timeless favorites for every wardrobe. Explore our latest collections, from best sellers to exclusive arrivals, and find pieces that let you express yourself with confidence and flair. Forever makes fashion effortless, stylish, and uniquely yours.           </p>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li><Link to='/' className='hover:text-black'>Home</Link></li>
                        <li><Link to='/shop/listing' className='hover:text-black'>Collections</Link></li>
                        <li><Link to='/shop/account' className='hover:text-black'>Account</Link></li>
                        <li><Link to='/shop/search' className='hover:text-black'>Search</Link></li>
                    </ul>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>+91-9086XXXXXX</li>
                        <li>naveedmalik1503@gmail.com</li>
                    </ul>
                </div>

            </div>

            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Designed and developed by Naveed Malik with ❤️ </p>
            </div>

        </div>
    )
}

export default Footer
