
import { adaptExpressRoute } from '@/infra/http'
import { Router } from 'express'
import { makeFacebookLoginController } from '../factories/controllers'
export default (router: Router): void => {
  const controller = makeFacebookLoginController()
  const adapter = adaptExpressRoute(controller)
  router.post('/api/login/facebook', adapter)
}
