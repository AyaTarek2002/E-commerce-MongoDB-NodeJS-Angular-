import {userSchema ,updateSchema }from "../validation/userValidation.js"

export const validateUser = (req, res, next) => {
    const validation = userSchema.validate(req.body, {abortEarly: false}); // abortEarly: false to get all errors
    if (validation.error) {
        return res.status(400).json({
            errors: validation.error.details.map((err) => err.message)// details , map => loop on array 
        })
    }
    next()
}

export const validateData = (req, res, next) => {
    const validation = updateSchema.validate(req.body, {abortEarly: false}); // abortEarly: false to get all errors
    if (validation.error) {
        return res.status(400).json({
            errors: validation.error.details.map((err) => err.message)// details , map => loop on array 
        })
    }
    next()
}