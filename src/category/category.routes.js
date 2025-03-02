import { Router } from 'express'
import { 
    addCategory
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

export default api