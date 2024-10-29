import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        // other fields...
    },
    { timestamps: true }
);

// Use mongoose.models to avoid OverwriteModelError
const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;
