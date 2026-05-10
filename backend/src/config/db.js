import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    // Safety check
    if (!uri) {
      throw new Error(
        "MONGO_URI is missing. Check your .env file and dotenv config."
      );
    }

    await mongoose.connect(uri);

    console.log("MongoDB connected successfully 🚀");
  } catch (error) {
    console.error("MongoDB connection failed ❌:", error.message);
    process.exit(1);
  }
};

export default connectDB;