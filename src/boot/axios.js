import axios from 'axios'
import { Encrypt } from '../assets/js/L3S'

export default async ({ Vue }) => {
  const currentDate = new Date()
  const day = currentDate.getDate()
  const month = currentDate.getMonth() + 1
  const year = currentDate.getFullYear()
  const nMonth = (month < 10) ? '0' + month.toString() : month.toString()
  const nDay = (day < 10) ? '0' + day.toString() : day.toString()
  const key = Encrypt(nDay + '-' + nMonth + '-' + year)

  /* **Server */
  const instance = axios.create({
    baseURL: 'https://ioi-server.herokuapp.com/http://gateway.davaocity.gov.ph/ioi/',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Secure-Connection': 'OCBO',
      'X-Data-Lock': key
    }
  })

  /* **Local */
  /* const instance = axios.create({
    baseurl: '',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Secure-Connection': 'OCBO',
      'X-Data-Lock': key
    }
  }) */

  instance.defaults.headers.post['Content-Type'] = 'application/json'

  Vue.prototype.$axios = instance
}
