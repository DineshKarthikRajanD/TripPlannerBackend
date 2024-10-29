import { Schema, model } from "mongoose";

const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
},
email: {
    type: String,
    required: true,
    unique: true,
},
// Add other fields as needed...
}, { timestamps: true });

const CustomerDetails = model("CustomerDetails", customerSchema);

export default CustomerDetails;
