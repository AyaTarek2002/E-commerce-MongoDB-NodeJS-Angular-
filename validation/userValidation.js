
import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 3 characters long",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
  }),

  password: Joi.string()
    .min(6)
    .max(20)
    .required()
    .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$"))
    .messages({
      "string.pattern.base": "Password must contain at least one letter and one number",
    }),
  phone: Joi.string()
  .pattern(new RegExp("^[0-9]{10}$"))
  .messages({
    "string.pattern.base": "Invalid phone number",
  }),
  role: Joi.string().valid("customer", "admin").default("user"),
  isConfirmed: Joi.boolean().default(false),
  walletBalance: Joi.number().default(0),
});
const updateSchema = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    "string.min": "Name must be at least 3 characters long",
  }),
  email: Joi.string().email().messages({
    "string.email": "Invalid email format",
  }),
  password: Joi.string()
    .min(6)
    .max(20)
    .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$"))
    .messages({
      "string.pattern.base": "Password must contain at least one letter and one number",
    }),
  phone: Joi.string()
    .pattern(new RegExp("^[0-9]{10}$"))
    .messages({
      "string.pattern.base": "Invalid phone number",
    }),
}).options({ stripUnknown: true });


export {userSchema ,updateSchema} 