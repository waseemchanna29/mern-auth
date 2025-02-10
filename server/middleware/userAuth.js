import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ status: false, error: 'Not Authorized Login Again' })
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id
        } else {
            return res.json({ status: false, error: 'Not Authorized Login Again' })
        }
        next();
    } catch (error) {
        res.json({ status: false, error: error.message })
    }
}

export default userAuth;