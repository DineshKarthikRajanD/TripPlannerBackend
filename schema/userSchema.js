import Joi from "joi";

const userSchema = Joi.object({
    username: Joi.string().required(), // Ensure username is required
    password: Joi.string().required(), // Ensure password is required
    // Add other fields as necessary
});

export const validateUser = (data) => {
    return userSchema.validate(data);
};
