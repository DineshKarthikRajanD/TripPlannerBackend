import mongoose from "mongoose";
const url="mongodb+srv://dineshkarthikrajand22cse:15xNZxGVX4zWzkHL@cluster0.meoth.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const dbconnect=async()=>{
    try {
        await mongoose.connect(url);
        console.log("db connected");
    } catch (error) {
        console.error(error);
    }
}
export default dbconnect;