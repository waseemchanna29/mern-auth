import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {

    try {
        const {userId} = req.body;
        
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({ status: false, error: "User not found" })
        }
        res.json({
            status:true,
            userData:{
                name:user.name,
                isAccountVerified: user.isAccountVerified
            }
        })

    } catch (error) {
        return res.json({ status: false, error: error.message })
    }
}