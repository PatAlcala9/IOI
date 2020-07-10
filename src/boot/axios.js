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
  /* const instance = axios.create({
    baseURL: 'https://cors-anywhere.herokuapp.com/122.2.27.43/index3.php?url=http://192.168.78.54/IOI/api/',
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }) */

  /* **New Server */
  /* const instance = axios.create({
    baseURL: 'https://ioi-server.herokuapp.com/eops.davaocity.gov.ph/ioi/',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Secure-Connection': 'OCBO',
      'X-Data-Lock': key
    }
  }) */

  /* **Local */
  const instance = axios.create({
    baseurl: 'https://ioi-server.herokuapp.com/http://localhost:27072',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Secure-Connection': 'OCBO',
      'X-Data-Lock': key
    }
  })

  instance.defaults.headers.post['Content-Type'] = 'application/json'

  Vue.prototype.$axios = instance
}
