import ProductSchema from "../validation/productValidation.js"

export const validateProduct = (req, res, next) => {
    const validation = ProductSchema.validate(req.body, {abortEarly: false}); // abortEarly: false to get all errors
    if (validation.error) {
        return res.status(400).json({
            errors: validation.error.details.map((err) => err.message)// details , map => loop on array 
        })
    }
    next()
}