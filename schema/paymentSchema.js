import Joi from 'joi';

const paymentSchema = Joi.object({
    amount: Joi.number().required(),
    method: Joi.string().valid('credit_card', 'paypal').required(),
    // Add other fields as needed...
});

export const validatePay = (data) => {
    return paymentSchema.validate(data);
};
