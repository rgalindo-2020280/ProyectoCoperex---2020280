import { Router } from 'express'
import { 
    addCompany 
} from './company.controller.js'

import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

api.post(
    '/addCompany',
    [validateJwt],
    addCompany
)

export default api