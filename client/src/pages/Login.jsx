import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContent } from '../context/AppContext'

const Login = () => {

  const navigate = useNavigate()
  const { apiUrl, setIsLoggedIn, getUserData } = useContext(AppContent )
  console.log(apiUrl);
  const [isSignUp, setIsSignUp] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;

      if (isSignUp) {
        const { data } = await axios.post(apiUrl + '/api/auth/register', { name, email, password })
        if (data.status) {
          //setIsLoggedIn(true);
          navigate('/')
        } else {
          toast.error(data.error);
        }
      } else {
        const { data } = await axios.post(apiUrl + '/api/auth/login', { email, password })
        if (data.status) {
          setIsLoggedIn(true);
          getUserData()
          navigate('/')
        } else {
          toast.error(data.error);
        }
      }

    } catch (error) {
      toast.error(error.error);
    }
  }
  return (
    <div className='flex justify-center items-center bg-gradient-to-br from-blue-100 to-purple-300 px-6 sm:px-0 min-h-screen'>
      <img onClick={() => navigate('/')} src={assets.logo} alt='' className='top-5 left-5 sm:left-20 absolute w-28 sm:w-32 cursor-pointer' />
      <div className='bg-slate-900 shadow-lg p-10 rounded-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='mb-3 font-semibold text-3xl text-center text-white'>{isSignUp ? "Create account" : "Login"}</h2>
        <p className='mb-6 text-center text-sm'>{isSignUp ? "Create your account" : "Login to your account!"}</p>

        <form onSubmit={onSubmitHandler} >
          {isSignUp && (
            <div className='flex items-center gap-3 bg-[#333A5C] mb-4 px-5 py-2.5 rounded-full w-full'>
              <img src={assets.person_icon} alt="" />
              <input
                onChange={e => setName(e.target.value)}
                value={name}
                className='bg-transparent outline-none' type="text" placeholder='Full Name' required />
            </div>)}


          <div className='flex items-center gap-3 bg-[#333A5C] mb-4 px-5 py-2.5 rounded-full w-full'>
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={e => setEmail(e.target.value)}
              value={email}
              className='bg-transparent outline-none' type="email" placeholder='Email Address' required />
          </div>
          <div className='flex items-center gap-3 bg-[#333A5C] mb-4 px-5 py-2.5 rounded-full w-full'>
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={e => setPassword(e.target.value)}
              value={password}
              className='bg-transparent outline-none' type="password" placeholder='Password' required />
          </div>

          <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password? </p>

          <button className='bg-gradient-to-r from-indigo-500 to-indigo-900 py-2.5 rounded-full w-full font-medium text-white'>{isSignUp ? "Sign Up" : "Login"}</button>
        </form>

        {isSignUp ? (
          <p className='mt-4 text-center text-gray-400 text-xs'> Already have an acount?{' '}
            <span onClick={() => setIsSignUp(false)} className='text-blue-400 underline cursor-pointer'>Login here</span>
          </p>
        ) : (
          <p className='mt-4 text-center text-gray-400 text-xs'> Don't have an acount?{' '}
            <span onClick={() => setIsSignUp(true)} className='text-blue-400 underline cursor-pointer'>Sign Up</span>
          </p>
        )}



      </div>
    </div>
  )
}

export default Login