import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='flex flex-col justify-center items-center bg-[url("bg_img.png")] bg-cover bg-center min-h-screen'>
        <Navbar />
        <Header />
    </div>
  )
}

export default Home