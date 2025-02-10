import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';

const EmailVerify = () => {
  const navigate = useNavigate();
  const { apiUrl, isLoggedIn, userData, getUserData } = useContext(AppContent)

  const inputRefs = React.useRef([])
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePast = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')

      const { data } = await axios.post(apiUrl + '/api/auth/verify-account', { otp })
      if (data.status) {
        toast.success(data.message)
        getUserData()
        navigate('/')
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error(error.message)

    }
  }

  useEffect(()=>{
isLoggedIn && userData && userData.isAccountVerified && navigate('/') 
  },[isLoggedIn, userData])
  return (
    <div className='flex justify-center items-center bg-gradient-to-br from-blue-100 to-purple-300 min-h-screen'>
      <img onClick={() => navigate('/')} src={assets.logo} alt='' className='top-5 left-5 sm:left-20 absolute w-28 sm:w-32 cursor-pointer' />
      <form onSubmit={onSubmitHandler} className='bg-slate-900 shadow-lg p-8 rounded-lg w-96 text-sm'>

        <h1 className='mb-4 font-semibold text-2xl text-center, text-white'>Email Verify OTP</h1>
        <p className='mb-6 text-center text-indigo-300'>Enter the 6-digit code sent to your email address.</p>
        <div className='flex justify-between mb-8' onPaste={handlePast} >
          {
            Array(6).fill(0).map((_, index) => (
              <input type="text" maxLength='1' key={index} required
                className='bg-[#333A5C] rounded-md w-12 h-12 text-center text-white text-xl'
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))
          }
        </div>
        <button className='bg-gradient-to-r from-indigo-500 to-indigo-900 py-3 rounded-full w-full text-white'>Verify email</button>
      </form>
    </div>
  )
}

export default EmailVerify