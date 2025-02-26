import { Router } from 'express'
import { 
    addCompany, 
    getByYears, 
    getCompaniesAZ, 
    getCompaniesZA,
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

api.get(
    '/getA-Z',
    [validateJwt],
    getCompaniesAZ
)

api.get(
    '/getZ-A',
    [validateJwt],
    getCompaniesZA
)

api.get(
    '/getByYears',
    [validateJwt],
    getByYears
)

export default api