// model/placeModel.js
import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // 'location' is an array of [longitude, latitude]
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

placeSchema.index({ location: '2dsphere' }); // Create a 2D sphere index for geospatial queries

const Place = mongoose.model("Place", placeSchema);

export default Place;
