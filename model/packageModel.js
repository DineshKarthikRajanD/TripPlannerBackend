import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  features: { type: [String], required: true },
  place: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  imageUrl: { type: String, required: true },
});


const Package = mongoose.model("Package", packageSchema);

export default Package; 
