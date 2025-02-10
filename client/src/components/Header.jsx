import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'

const  Header = () => {
    
    const  {userData} = useContext(AppContent)

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
        <img src={assets.header_img} alt='' className='mb-6 rounded-full w-36 h-36' />
        
        <h1 className='flex items-center gap-2 mb-2 font-medium text-xl sm:text-3xl'> Hey {userData? userData.name: "Developer"} ! <img src={assets.hand_wave} className='w-8 aspect-square' alt='' /></h1>

        <h2 className='mb-4 font-semibold text-3xl sm:text-5xl'>Welcome to our app </h2>
        
        <p className='mb-8 max-w-md'>Let's start with a quick product tour and we will have you up and ruuning in no time!</p>
        <button className='border-gray-500 hover:bg-gray-100 px-8 py-2.5 border rounded-full transition-all'>Get Started</button>
    </div>
  )
}

export default Header;