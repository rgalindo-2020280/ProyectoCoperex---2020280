import { Router } from 'express'
import { 
    addCategory,
    getAllCategories
} from './category.controller.js'
import { validateJwt} from '../../middlewares/validate.jwt.js'
import { categoryValidator } from '../../helpers/validator.js'


const api = Router()

api.post(
    '/addCategory',
    [validateJwt],
    [categoryValidator],
    addCategory
)

api.get(
    '/getCategories',
    [validateJwt],
    getAllCategories
)

export default api