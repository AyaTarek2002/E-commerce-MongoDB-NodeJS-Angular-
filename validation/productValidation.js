
import Joi from "joi";

const ProductSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 3 characters long",
  }),

  description: Joi.string(),

  price: Joi.number()
  .integer()
  .min(1)
  .required()
  .messages({
    "number.base": "Price must be a number",
    "number.min": "Price must be at least 1",
}),
  stock: Joi.number()
  .integer().default(0)
  .min(0)
  .messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock must be at least 0",
    }),
    category: Joi.string().required().messages({
        "string.empty": "Category cannot be empty",
    }),
    image: Joi.string().required().messages({
        "string.empty": "Image cannot be empty",
    }),
});

export default ProductSchema