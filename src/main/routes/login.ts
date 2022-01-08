
import { Router } from 'express'
export default (router: Router): void => {
  router.post('/api/login/facebook', (req, resp) => {
    resp.send({ data: 'any_data' })
  })
}
