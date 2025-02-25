import { Router } from 'express'
import { 
    addCompany, 
    updateCompany
} from './company.controller.js'

import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

api.post(
    '/addCompany',
    [validateJwt],
    addCompany
)

api.put(
    '/:id',
    [validateJwt],
    updateCompany
)

export default api