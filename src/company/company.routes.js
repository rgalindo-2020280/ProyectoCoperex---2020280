import { Router } from 'express'
import { 
    addCompany, 
    getByYears, 
    getCompaniesAZ, 
    getCompaniesZA,
    updateCompany
} from './company.controller.js'

import { validateJwt } from '../../middlewares/validate.jwt.js'
import { addCompanyValidator, updateCompanyValidator} from '../../helpers/validator.js'

const api = Router()

api.post(
    '/addCompany',
    [validateJwt],
    [addCompanyValidator],
    addCompany
)

api.put(
    '/:id',
    [validateJwt],
    [updateCompanyValidator],
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