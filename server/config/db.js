import mongoose from "mongoose";

const connectDB = async() => {
    try {

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...')
        
    } catch (error) {
         console.log('Database Connection Error')
    }
}

export default connectDB;