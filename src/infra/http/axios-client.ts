import { HttpGetClient } from '@/infra/http'
import axios from 'axios'

export class AxiosHttpClient implements HttpGetClient {
  async get <T = any> (args: HttpGetClient.Params): Promise<T> {
    const response = await axios.get(args.url, { params: args.params })
    return response.data
  }
}
