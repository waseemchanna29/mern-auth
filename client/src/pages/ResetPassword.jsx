import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { apiUrl } = useContext(AppContent)
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState(0)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

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

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmitted(true)
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(apiUrl + '/api/auth/send-reset-otp', { email })
      data.status ? toast.success(data.message) : toast.error(data.error)
      data.status && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(apiUrl + '/api/auth/reset-password', {
        email, otp, newPassword
      })
      data.status ? toast.success(data.message) : toast.error(data.error)
      data.status && navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div className='flex justify-center items-center bg-gradient-to-br from-blue-100 to-purple-300 min-h-screen'>
      <img onClick={() => navigate('/')} src={assets.logo} alt='' className='top-5 left-5 sm:left-20 absolute w-28 sm:w-32 cursor-pointer' />

      {/* Enter email adddress */}
      {!isEmailSent &&
        <form onSubmit={onSubmitEmail} className='bg-slate-900 shadow-lg p-8 rounded-lg w-96 text-sm'>
          <h1 className='mb-4 font-semibold text-2xl text-center text-white'>Reset Password</h1>
          <p className='mb-6 text-center text-indigo-300'>Enter your registered email address.</p>
          <div className='flex items-center gap-3 bg-[#333A5C] mb-4 px-5 py-2.5 rounded-full w-full'>
            <img src={assets.mail_icon} alt="" className='w-3 h-3' />
            <input type="email" placeholder='Email Address' className='bg-transparent text-white outline-none'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <button className='bg-gradient-to-r from-indigo-500 to-indigo-900 mt-3 py-2.5 rounded-full w-full text-white'>Submit</button>
        </form>
      }

      {/* otp input form */}
      {!isOtpSubmitted && isEmailSent &&
        <form onSubmit={onSubmitOtp} className='bg-slate-900 shadow-lg p-8 rounded-lg w-96 text-sm'>

          <h1 className='mb-4 font-semibold text-2xl text-center, text-white'>Reset Password OTP</h1>
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
          <button className='bg-gradient-to-r from-indigo-500 to-indigo-900 py-2.5 rounded-full w-full text-white'>Submit</button>
        </form>
      }

      {/* enter new password */}
      {isOtpSubmitted && isEmailSent &&
        <form onSubmit={onSubmitNewPassword} className='bg-slate-900 shadow-lg p-8 rounded-lg w-96 text-sm'>
          <h1 className='mb-4 font-semibold text-2xl text-center text-white'>New Password</h1>
          <p className='mb-6 text-center text-indigo-300'>Enter your new password below.</p>
          <div className='flex items-center gap-3 bg-[#333A5C] mb-4 px-5 py-2.5 rounded-full w-full'>
            <img src={assets.lock_icon} alt="" className='w-3 h-3' />
            <input type="password" placeholder='Password' className='bg-transparent text-white outline-none'
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button className='bg-gradient-to-r from-indigo-500 to-indigo-900 mt-3 py-2.5 rounded-full w-full text-white'>Submit</button>
        </form>
      }
    </div>
  )
}

export default ResetPassword