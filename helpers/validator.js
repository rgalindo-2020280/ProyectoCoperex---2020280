import { body } from 'express-validator'
import { validateErrorWithoutImg } from './validate.error.js'
import { existUsername, existEmail, objectIdValid } from './db.validators.js'

export const registerValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
    body('phone', 'Phone cannot be empty or is not a valid phone')
        .notEmpty()
        .isMobilePhone(),
    validateErrorWithoutImg
]

export const loginValidator = [
    body('userLoggin', 'Username or email cannot be empty')
        .notEmpty()
        .toLowerCase(),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
    validateErrorWithoutImg
]

export const categoryValidator = [
    body('name')
        .notEmpty().withMessage('Category name cannot be empty')
        .isString().withMessage('Category name must be a valid string')
        .isLength({ max: 50 }).withMessage('Category name must not exceed 50 characters')
        .custom(async (name) => {
            const existingCategory = await Category.findOne({ name })
            if (existingCategory) {
                throw new Error('Category already exists')
            }
        }),
    body('description')
        .optional()
        .isString().withMessage('Description must be a string')
        .isLength({ max: 250 }).withMessage('Description must not exceed 250 characters'),
    body('companyIds')
        .optional()
        .isArray().withMessage('Company IDs must be an array')
        .custom(async (companyIds) => {
            if (!Array.isArray(companyIds)) {
                throw new Error('Company IDs must be an array')
            }

            const existingCompanies = await Company.find({ _id: { $in: companyIds } })
            if (existingCompanies.length !== companyIds.length) {
                throw new Error('Some companies do not exist')
            }
        }
    )
]