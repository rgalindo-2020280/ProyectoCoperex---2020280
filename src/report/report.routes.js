import { Router } from 'express'
import { 
    generateReport 
} from './report.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

api.get(
    '/Excel',
    [validateJwt],
    generateReport
)

export default api
