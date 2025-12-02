import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGODB_URL || "mongodb://localhost:27017/";
const mongoName = process.env.MONGODB_COLLECTION_NAME;

export const connectDatabase = async () => {
  await mongoose.connect(mongoURI + mongoName);
};
