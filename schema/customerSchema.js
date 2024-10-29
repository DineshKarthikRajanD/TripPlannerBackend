import Joi from "joi";

const customerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),

});

export const validateCustomer = (data) => {
    return customerSchema.validate(data);
};


