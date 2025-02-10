import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ status: false, error: 'Missing Info' });
    }

    try {
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.json({ status: false, error: 'User already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        // sending welcom email
        const mailOption = {
            from: process.env.MAIL_FROM_ADDRESS,
            to: email,
            subject: "Welcom to Mern Tutorial",
            text: `Welecome ${name} to the MERN Tutorial, Your account has been created with the email id: ${email}`
        }

        await transporter.sendMail(mailOption);
        return res.json({ status: true })

    } catch (error) {
        return res.json({ status: false, error: error.message });
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.json({ status: false, error: 'Email or Password are required' });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ status: false, error: 'Invalid Email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ status: false, error: 'Invalid Password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.MODE_ENV === 'production',
            sameSite: process.env.MODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 100

        })

        return res.json({ status: true })
    } catch (error) {
        return res.json({ status: false, error: error.message });
    }

}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.MODE_ENV === 'production',
            sameSite: process.env.MODE_ENV === 'production' ? 'none' : 'strict',
        })
        return res.json({ status: true, message: 'Logged Out' })
    } catch (error) {
        return res.json({ status: false, error: error.message });
    }
}

export const sendVerifyOtp = async (req, res) => {
    try {

        const { userId } = req.body;
        const user = await userModel.findById(userId);

        if (user.isAccountVerified) {
            return res.json({ status: false, error: "Account Already Verified" })
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = otp;
        user.verifyOptExpireAt = Date.now() + 24 * 60 * 60 * 1000
        await user.save();
        // sending welcom email
        const mailOption = {
            from: process.env.MAIL_FROM_ADDRESS,
            to: user.email,
            subject: "Account Verify Otp",
            //text: `Your OTP is ${otp}. Verify your account using this OTP`
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        await transporter.sendMail(mailOption);
        return res.json({ status: true, message: "Verification OTP sent on Email" })

    } catch (error) {
        return res.json({ status: false, error: error.message })
    }
}


export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.json({ status: false, error: 'Missing Details' })
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ status: false, error: 'User not found' })
        }
        if (user.verifyOtp === '' || user.verifyOtp != otp) {
            return res.json({ status: false, error: 'Invalid OTP' })
        }

        if (user.verifyOptExpireAt < Date.now()) {
            return res.json({ status: false, error: 'OTP Expired' })
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        user.save();
        return res.json({ status: true, message: 'Email Verified Successfully' })

    } catch (error) {
        return res.json({ status: false, error: error.message })
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ status: true, });
    } catch (error) {
        return res.json({ status: false, error: error.message })
    }
}


// Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({ status: false, error: "Email is requied" })
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ status: false, error: "User not found" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 60 * 1000
        await user.save();
        // sending welcom email
        const mailOption = {
            from: process.env.MAIL_FROM_ADDRESS,
            to: user.email,
            subject: "Password Reset Otp",
            //text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password`
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }

        await transporter.sendMail(mailOption);
        return res.json({ status: true, message: "OTP sent to your email" })

    } catch (error) {
        return res.json({ status: false, error: error.message })
    }
}

//  Reset User Pasword
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.json({ status: false, error: "Email, OTP and New Password are requied" })
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ status: false, error: "User not found" })
        }

        if (user.resetOtp === "" || user.resetOtp != otp) {
            return res.json({ status: false, error: 'Invalid OTP' })
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ status: false, error: 'OTP Expired' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        user.save();

        return res.json({ status: true, message: 'Password has been reset Successfully' })

    } catch (error) {
        return res.json({ status: false, error: error.message })
    }
}