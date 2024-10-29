import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        mobile: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        packageTitle: {
            type: String,
            required: true,
        },
        paymentId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const PayModel = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);


export default PayModel; // Change to ES module export
