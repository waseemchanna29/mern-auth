import mongoose from "mongoose";



const connectDB = async ()=>{
    const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mern-auth";

   
    mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));
}
export default connectDB;