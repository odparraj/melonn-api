import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'

const baseUrl = Env.get('MELONN_API_URL')
const melonnToken = Env.get('MELONN_TOKEN')

const service = axios.create({
  baseURL: baseUrl,
  headers: {
    'x-api-key': melonnToken,
  }
})

export default service