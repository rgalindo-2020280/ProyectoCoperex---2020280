import { Router } from 'express'
import { 
    addCategory
} from './category.controller.js'
import { validateJwt} from '../../middlewares/validate.jwt.js'


const api = Router()

api.post(
    '/addCategory',
    [validateJwt],
    addCategory
)

export default api