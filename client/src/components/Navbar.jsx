import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function Navbar() {
  const navigate = useNavigate()
  const { userData, apiUrl, setUserData, setIsLoggedIn } = useContext(AppContent)

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true

      const { data } = await axios.post(apiUrl + "/api/auth/send-verify-otp")

      if (data.status) {
        navigate('/email-verify')
        toast.success(data.message)
      } else {
        toast.error(data.error)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(apiUrl + '/api/auth/logout')
      data.status && setIsLoggedIn(false)
      data.status && setUserData(false)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='top-0 absolute flex justify-between items-center sm:px-24 p-4 sm:p-6 w-full'>
      <img src={assets.logo} alt='' className='w-28 sm:w-32' />
      {userData ?
        <div className='group relative flex justify-center items-center bg-black rounded-full w-8 h-8 text-white'>
          {userData.name[0].toUpperCase()}
          <div className='group-hover:block top-0 right-0 z-10 absolute hidden pt-10 rounded text-black'>
            <ul className='bg-gray-100 m-0 p-2 text-sm list-none'>
              {
                !userData.isAccountVerified && <li onClick={sendVerificationOtp} className='hover:bg-gray-200 px-2 py-1 cursor-pointer'>Verify Email</li>
              }

              <li onClick={logout} className='hover:bg-gray-200 px-2 py-1 pr-10 cursor-pointer'>Logout</li>
            </ul>
          </div>
        </div>
        : <button
          onClick={() => navigate('/login')}
          className='flex items-center gap-2 border-gray-500 hover:bg-gray-100 px-6 py-2 border rounded-full text-gray-800 transition-all'>Login <img src={assets.arrow_icon} alt='' /></button>
      }

    </div>
  )
}

export default Navbar