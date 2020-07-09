<template>
  <q-page>
    <div v-if="dark" class="workArea-dark" v-touch-swipe.mouse.left="handler(false)">
      <div class="grid-container">
        <div v-if="offline" class="online-notify">
          <!-- <offline></offline> -->
        </div>

        <div class="main">
          <img class="logo" ref="logox" src="../assets/ocbologo.svg" alt="OCBO Logo" @click="bounceLogo"/>
          <br/>
          <h2 class="page-title h2-light" @click="rotateTitle">IIPS Online Inspection</h2>

          <div class="form-dark">
            <div class="form-title">Login</div>
            <div class="br"></div>
            <q-input dark v-model="username" type="text" label="Username" mask="XXXXXXXXXXXXXXX" class="textbox"/>
            <q-input dark v-model="password" type="password" label="Password" mask="XXXXXXXXXXXXXXX" class="textbox" @keypress.enter="login2(username, password)"/>
            <q-btn class="qButton" color="primary" label="Login" @click="login2(username, password)"/>
            <br/>
            <q-btn flat color="primary" label="Trouble Signing In?" @click="forgotPassword" />
          </div>

          <span class="docs" @click="openDocs">See Documentation</span>

          <div class="davaologo">
            <img class="logoglow" src="../assets/davaologo_glow.png" alt="Davao Logo" @click="rotateLogo"/>
          </div>

          <footer>{{footer}}</footer>
        </div>

        <div class="mode">
          <img class="cursor-pointer" src="../assets/day.svg" alt="Day Mode" width="45px" height="45px" @click="nightmode(false)">
        </div>
      </div>
    </div>

    <div v-else class="workArea" v-touch-swipe.mouse.right="handler(true)">
      <div class="grid-container">
        <div v-if="offline" class="online-notify">
          <!-- <offline></offline> -->
        </div>

        <div class="main">
          <img class="logo" ref="logox" src="../assets/ocbologo.svg" alt="OCBO Logo" @click="bounceLogo"/>
          <br/>
          <h2 class="page-title h2-light" @click="rotateTitle">IIPS Online Inspection</h2>

          <div class="form-light">
            <div class="form-title">Login</div>
            <div class="br"></div>
            <q-input v-model="username" type="text," label="Username" mask="XXXXXXXXXXXXXXX" class="textbox"/>
            <q-input v-model="password" type="password" label="Password" mask="XXXXXXXXXXXXXXX" class="textbox" @keypress.enter="login2(username, password)"/>
            <q-btn class="qButton" color="primary" label="Login" @click="login2(username, password)"/>
            <br/>
            <q-btn flat color="primary" label="Trouble Signing In?" @click="forgotPassword" />
          </div>
          <span class="docs" @click="openDocs">See Documentation</span>

          <div class="davaologo">
            <img class="logoglow" src="../assets/davaologo_glow.png" alt="Davao Logo" @click="rotateLogo"/>
          </div>

          <footer>{{footer}}</footer>

        </div>

        <div class="mode">
          <img class="cursor-pointer" src="../assets/night2.svg" alt="Night Mode" width="35px" height="35px" @click="nightmode(true)">
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
const Swal = require('sweetalert2')
const l3s = require('../assets/js/L3S')
const json = require('zipson')
import { Bounce, Elastic, gsap } from 'gsap/dist/gsap'

export default {
  name: 'PageIndex',
  data () {
    return {
      username: '',
      password: '',
      footer: 'Office of the City Building Official, Copyright 2020',
      ePassword: '',
      dbPassword: '',
      dark: false,
      offline: false,
      one: '',
      loggedIn: false
    }
  },
  components: {},
  computed: {},
  methods: {
    intro () {
      return new Promise((resolve, reject) => {
        const load = true
        if (load) {
          resolve()
        } else {
          reject()
        }
      })
    },
    rotateTitle () {
      gsap.to('.page-title', { duration: 1.5, rotationY: '+=360' })
    },
    bounceLogo () {
      gsap.to('.logo', { duration: 0.4, scale: 1.5, ease: Bounce.easeOut })
      gsap.to('.logo', { duration: 0.2, scale: 1, delay: 0.4 })
    },
    rotateLogo () {
      gsap.to('.logoglow', { duration: 1.5, rotationY: '+=360' })
    },
    animate () {
      const tl = gsap.timeline({ default: { duration: 0.8 } })
      tl.from('.page-title', { scale: 0, ease: Elastic.easeOut })
      tl.from('.logo', { scale: 0, ease: Elastic.easeOut }, '-=0.2')
      tl.from('.form-light', { opacity: 0, scale: 0.8, ease: Elastic.easeOut }, '-=0.2')
      tl.from('.form-dark', { opacity: 0, scale: 0.8, ease: Elastic.easeOut }, '-=0.2')
      tl.from('.docs', { opacity: 0, scale: 0.8, ease: Elastic.easeOut }, '-=0.1')
      tl.from('.davaologo', { scale: 0, ease: Elastic.easeOut }, '-=0.3')
      tl.from('footer', { scale: 0, ease: Elastic.easeOut }, '-=0.2')
    },
    checkLogin () {
      if (this.$q.sessionStorage.has('__' + l3s.Encrypt('id') + '_token') === true) {
        this.$router.push('main', () => {})
      } else {
        this.$router.push('/', () => {})
      }
    },
    checkConnected () {
      this.$axios.get('/api/CheckConnected')
        .then((response) => {
          const decrypted = response.data[0].one
          // let jsonize = json.parse(decrypted)
          this.one = decrypted
          this.offline = false
        })
        .catch(() => {
          this.offline = true
        })
    },
    checkDark () {
      if (this.$q.sessionStorage.has('__' + l3s.Encrypt('dark') + '_token') === true) {
        this.nightmode(true)
      } else {
        this.nightmode(false)
      }
    },
    openDocs () {
      this.$router.push('docs', () => {})
    },
    camera () {
      this.$router.push('camera', () => {})
    },
    async getEmployee () {
      const curDate = new Date()
      const curDay = curDate.getDate()
      const curMonth = curDate.getMonth() + 1
      const curYear = curDate.getFullYear()
      const nMonth = (curMonth < 10) ? '0' + curMonth.toString() : curMonth.toString()
      const nDay = (curDay < 10) ? '0' + curDay.toString() : curDay.toString()
      const locker = l3s.Encrypt('Re' + nMonth + nDay + curYear + '1')

      await this.$axios.get('/api/Refresh/' + locker)
        .then((response) => {
          const decrypted = response.data
          const jsonize = json.stringify(decrypted)
          // let valid = jsonize[0].Count
          const employeeList = '__' + l3s.Encrypt('employeeList') + '_token'
          const employeeListContent = l3s.EncryptNetwork(jsonize)
          this.$q.localStorage.remove(employeeList)
          this.$q.localStorage.set(employeeList, employeeListContent)
        })
        .catch(() => {
          // this.getEmployee()
        })
    },
    async getAllBuilding () {
      await this.$axios.get('/api/GetAllBuilding')
        .then((response) => {
          const decrypted = response.data
          const jsonize = json.stringify(decrypted)
          const buildingList = '__' + l3s.Encrypt('buildingList') + '_token'
          const buildingListContent = l3s.EncryptNetwork(jsonize)
          this.$q.localStorage.remove(buildingList)
          this.$q.localStorage.set(buildingList, buildingListContent)
        })
        .catch(() => {
          // this.getAllBuilding()
        })
    },
    async getAllDocflow () {
      await this.$axios.get('/api/GetAllDocflow')
        .then((response) => {
          const decrypted = response.data
          const jsonize = json.stringify(decrypted)
          const docflowList = '__' + l3s.Encrypt('docflowList') + '_token'
          const docflowListContent = l3s.EncryptNetwork(jsonize)
          this.$q.localStorage.remove(docflowList)
          this.$q.localStorage.set(docflowList, docflowListContent)
        })
        .catch(() => {
          // this.getAllDocflow()
        })
    },
    async login (uname, pword) {
      const ePass = l3s.Encrypt(pword)
      let jsonize
      let decrypted

      // if (this.offline) {
      //  this.login_offline()
      // }

      this.$q.loading.show()
      await this.$axios.get('/api/' + l3s.EncryptNetwork('checkUsername') + '/' + (uname))
        .then((response) => {
          decrypted = l3s.DecryptNetwork(response.data)
          jsonize = json.parse(decrypted)
          const valid = jsonize[0].Count

          if (valid > 0) {
            this.$axios.get('/api/' + l3s.EncryptNetwork('checkPassword') + '/' + (uname))
              .then((response) => {
                decrypted = l3s.DecryptNetwork(response.data)
                this.ePassword = ePass
                jsonize = json.parse(decrypted)
                this.dbpassword = jsonize[0].password

                if (this.ePassword === this.dbpassword) {
                  this.$axios.get('/api/' + l3s.EncryptNetwork('getEmployeeData') + '/' + (uname))
                    .then((response) => {
                      decrypted = l3s.DecryptNetwork(response.data)
                      jsonize = json.parse(decrypted)
                      this.employeeid = jsonize[0].employeeid
                      const inspector = jsonize[0].is_inspector
                      const ename = jsonize[0].employeename

                      if (inspector > 0) {
                        this.$axios.get('/api/' + l3s.EncryptNetwork('checkOnline') + '/' + (this.employeeid))
                          .then((response) => {
                            decrypted = l3s.DecryptNetwork(response.data)
                            jsonize = json.parse(decrypted)
                            const isonline = jsonize[0].is_online

                            if (isonline === 0) {
                              this.$q.sessionStorage.remove('__' + l3s.Encrypt('id') + '_token')
                              this.$q.sessionStorage.set('__' + l3s.Encrypt('id') + '_token', l3s.EncryptNetwork(this.employeeid))

                              this.$axios.get('/api/' + l3s.EncryptNetwork('getAllAccess') + '/' + (this.employeeid))
                                .then((response) => {
                                  const decrypted = l3s.DecryptNetwork(response.data)
                                  const jsonize = json.parse(decrypted)
                                  const access = jsonize

                                  this.$axios.put('/api/' + l3s.EncryptNetwork('setOnline') + '/' + (this.employeeid), {
                                    is_online: 1
                                  })

                                  for (const i in access) {
                                    if (access[i].ref_accessid === 119) {
                                      this.$q.sessionStorage.remove('__' + l3s.Encrypt('buildinglineandgrade') + '_token')
                                      this.$q.sessionStorage.set('__' + l3s.Encrypt('buildinglineandgrade') + '_token', l3s.EncryptNetwork(true))
                                    } else if (access[i].ref_accessid === 120) {
                                      this.$q.sessionStorage.remove('__' + l3s.Encrypt('occupancylineandgrade') + '_token')
                                      this.$q.sessionStorage.set('__' + l3s.Encrypt('occupancylineandgrade') + '_token', l3s.EncryptNetwork(true))
                                    } else if (access[i].ref_accessid === 59) {
                                      this.$q.sessionStorage.remove('__' + l3s.Encrypt('signage') + '_token')
                                      this.$q.sessionStorage.set('__' + l3s.Encrypt('signage') + '_token', l3s.EncryptNetwork(true))
                                    } else if (access[i].ref_accessid === 76) {
                                      this.$q.sessionStorage.remove('__' + l3s.Encrypt('electrical') + '_token')
                                      this.$q.sessionStorage.set('__' + l3s.Encrypt('electrical') + '_token', l3s.EncryptNetwork(true))
                                    } else if (access[i].ref_accessid === 100) {
                                      this.$q.sessionStorage.remove('__' + l3s.Encrypt('mechanical') + '_token')
                                      this.$q.sessionStorage.set('__' + l3s.Encrypt('mechanical') + '_token', l3s.EncryptNetwork(true))
                                    } else if (access[i].ref_accessid === 121) {
                                      this.$q.sessionStorage.remove('__' + l3s.Encrypt('buildingarchitecture') + '_token')
                                      this.$q.sessionStorage.set('__' + l3s.Encrypt('buildingarchitecture') + '_token', l3s.EncryptNetwork(true))
                                    } else if (access[i].ref_accessid === 122) {
                                      this.$q.sessionStorage.remove('__' + l3s.Encrypt('occupancyarchitecture') + '_token')
                                      this.$q.sessionStorage.set('__' + l3s.Encrypt('occupancyarchitecture') + '_token', l3s.EncryptNetwork(true))
                                    } else if (access[i].ref_accessid === 123) {
                                      this.$q.sessionStorage.remove('__' + l3s.Encrypt('buildingstructural') + '_token')
                                      this.$q.sessionStorage.set('__' + l3s.Encrypt('buildingstructural') + '_token', l3s.EncryptNetwork(true))
                                    } else if (access[i].ref_accessid === 124) {
                                      this.$q.sessionStorage.remove('__' + l3s.Encrypt('occupancystructural') + '_token')
                                      this.$q.sessionStorage.set('__' + l3s.Encrypt('occupancystructural') + '_token', l3s.EncryptNetwork(true))
                                    } else if (access[i].ref_accessid === 125) {
                                      this.$q.sessionStorage.remove('__' + l3s.Encrypt('buildingsanitaryplumbing') + '_token')
                                      this.$q.sessionStorage.set('__' + l3s.Encrypt('buildingsanitaryplumbing') + '_token', l3s.EncryptNetwork(true))
                                    } else if (access[i].ref_accessid === 126) {
                                      this.$q.sessionStorage.remove('__' + l3s.Encrypt('occupancysanitaryplumbing') + '_token')
                                      this.$q.sessionStorage.set('__' + l3s.Encrypt('occupancysanitaryplumbing') + '_token', l3s.EncryptNetwork(true))
                                    } else if (access[i].ref_accessid === 127) {
                                      this.$q.sessionStorage.remove('__' + l3s.Encrypt('buildingelectrical') + '_token')
                                      this.$q.sessionStorage.set('__' + l3s.Encrypt('buildingelectrical') + '_token', l3s.EncryptNetwork(true))
                                    } else if (access[i].ref_accessid === 128) {
                                      this.$q.sessionStorage.remove('__' + l3s.Encrypt('occupancyelectrical') + '_token')
                                      this.$q.sessionStorage.set('__' + l3s.Encrypt('occupancyelectrical') + '_token', l3s.EncryptNetwork(true))
                                    } else if (access[i].ref_accessid === 129) {
                                      this.$q.sessionStorage.remove('__' + l3s.Encrypt('buildingmechanical') + '_token')
                                      this.$q.sessionStorage.set('__' + l3s.Encrypt('buildingmechanical') + '_token', l3s.EncryptNetwork(true))
                                    } else if (access[i].ref_accessid === 130) {
                                      this.$q.sessionStorage.remove('__' + l3s.Encrypt('occupancymechanical') + '_token')
                                      this.$q.sessionStorage.set('__' + l3s.Encrypt('occupancymechanical') + '_token', l3s.EncryptNetwork(true))
                                    } else if (access[i].ref_accessid === 131) {
                                      this.$q.sessionStorage.remove('__' + l3s.Encrypt('zoning') + '_token')
                                      this.$q.sessionStorage.set('__' + l3s.Encrypt('zoning') + '_token', l3s.EncryptNetwork(true))
                                    } else if (access[i].ref_accessid === 132) {
                                      this.$q.sessionStorage.remove('__' + l3s.Encrypt('bfp') + '_token')
                                      this.$q.sessionStorage.set('__' + l3s.Encrypt('bfp') + '_token', l3s.EncryptNetwork(true))
                                    }
                                    this.$q.sessionStorage.remove('__' + l3s.Encrypt('employeename') + '_token')
                                    this.$q.sessionStorage.set('__' + l3s.Encrypt('employeename') + '_token', l3s.EncryptNetwork(ename))

                                    this.$q.localStorage.remove('__' + l3s.Encrypt('username') + '_token')
                                    this.$q.localStorage.set('__' + l3s.Encrypt('username') + '_token', l3s.EncryptNetwork(this.username))
                                    this.$q.localStorage.remove('__' + l3s.Encrypt('password') + '_token')
                                    this.$q.localStorage.set('__' + l3s.Encrypt('password') + '_token', l3s.EncryptNetwork(this.dbpassword))
                                    this.$q.localStorage.remove('__' + l3s.Encrypt('name') + '_token')
                                    this.$q.localStorage.set('__' + l3s.Encrypt('name') + '_token', l3s.EncryptNetwork(ename))

                                    this.$q.loading.hide()
                                    this.checkDark()
                                    let color
                                    if (this.dark) {
                                      color = '#020110'
                                    } else {
                                      color = 'white'
                                    }
                                    Swal.fire({
                                      title: 'WELCOME ' + ename,
                                      type: 'success',
                                      confirmButtonText: 'Proceed',
                                      background: color
                                    })
                                    this.$router.push('main', () => {})
                                  }
                                })
                                .catch(() => {
                                  this.$q.loading.hide()
                                  this.checkDark()
                                  let color
                                  if (this.dark) {
                                    color = '#020110'
                                  } else {
                                    color = 'white'
                                  }
                                  Swal.fire({
                                    title: 'Login Failed',
                                    text: 'No Connection on Server',
                                    type: 'error',
                                    confirmButtonText: 'Retry',
                                    background: color
                                  })
                                })
                            } else {
                              this.$q.loading.hide()
                              this.checkDark()
                              let color
                              if (this.dark) {
                                color = '#020110'
                              } else {
                                color = 'white'
                              }
                              Swal.fire({
                                title: 'Login Failed',
                                text: 'Account is already Online',
                                type: 'error',
                                background: color
                              })
                            }
                          })
                      } else {
                        this.$q.loading.hide()
                        this.checkDark()
                        let color
                        if (this.dark) {
                          color = '#020110'
                        } else {
                          color = 'white'
                        }
                        Swal.fire({
                          title: 'Invalid Login, Inspectors Only',
                          type: 'error',
                          confirmButtonText: 'Proceed',
                          background: color
                        })
                      }
                    })
                } else {
                  this.$q.loading.hide()
                  this.checkDark()
                  let color
                  if (this.dark) {
                    color = '#020110'
                  } else {
                    color = 'white'
                  }
                  Swal.fire({
                    type: 'error',
                    title: 'Invalid Password',
                    background: color
                  })
                  this.password = ''
                  sessionStorage.removeItem('__' + l3s.Encrypt('id') + '_token')
                }
              })
              .catch(() => {
                this.$q.loading.hide()
                this.checkDark()
                let color
                if (this.dark) {
                  color = '#020110'
                } else {
                  color = 'white'
                }
                Swal.fire({
                  type: 'error',
                  title: 'No Connection on Server',
                  background: color
                })
                this.checkConnected()
                sessionStorage.removeItem('__' + l3s.Encrypt('id') + '_token')
              })
          } else {
            this.$q.loading.hide()
            this.checkDark()
            let color
            if (this.dark) {
              color = '#020110'
            } else {
              color = 'white'
            }
            Swal.fire({
              type: 'error',
              title: 'Username does not exist',
              background: color
            })
            sessionStorage.removeItem('__' + l3s.Encrypt('id') + '_token')
          }
        })
        .catch(() => {
          this.$q.loading.hide()
          Swal.fire({
            type: 'error',
            title: 'No Connection on Server'
          })
          this.checkConnected()
        })
    },
    async login2 (uname, pword) {
      if (this.$q.localStorage.has('__' + l3s.Encrypt('employeeList') + '_token') === true) {
        this.$q.loading.show()
        const employeeListContent = await l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('employeeList') + '_token'))
        const employeeListJSON = json.parse(employeeListContent)
        const ePassword = l3s.Encrypt(pword)
        let dbPassword
        let fullname
        let employeeid
        let isInspector

        for (let i = 0; i < employeeListJSON.length; i++) {
          if (employeeListJSON[i].twou === uname.toUpperCase()) {
            dbPassword = await employeeListJSON[i].threep
            fullname = await employeeListJSON[i].fivee
            employeeid = await employeeListJSON[i].onee
            isInspector = await employeeListJSON[i].fouri
            break
          }
        }
        // console.log('fullname: ' + fullname)

        if (fullname === undefined) {
          this.$q.loading.hide()
          this.checkDark()
          let color
          if (this.dark) {
            color = '#020110'
          } else {
            color = 'white'
          }
          Swal.fire({
            type: 'error',
            title: 'Invalid Username',
            text: 'Username does not exist',
            background: color
          })
          return
        }

        if (ePassword === dbPassword) {
          this.$q.loading.hide()
          this.checkDark()
          let color
          if (this.dark) {
            color = '#020110'
          } else {
            color = 'white'
          }

          if (isInspector === 0) {
            Swal.fire({
              type: 'error',
              title: 'Invalid Login',
              text: 'Only Inspectors are allowed',
              background: color
            })
            return
          }

          this.$q.sessionStorage.remove('__' + l3s.Encrypt('id') + '_token')
          this.$q.sessionStorage.set('__' + l3s.Encrypt('id') + '_token', l3s.EncryptNetwork(employeeid))

          this.$axios.get('/api/GetAllAccess' + '/' + (employeeid))
            .then((response) => {
              const decrypted = []
              for (let i = 0; i < response.data.length; i++) {
                decrypted.push(response.data[i].ref_accessid)

                if (response.data[i].ref_accessid === 119) {
                  this.$q.sessionStorage.remove('__' + l3s.Encrypt('buildinglineandgrade') + '_token')
                  this.$q.sessionStorage.set('__' + l3s.Encrypt('buildinglineandgrade') + '_token', l3s.EncryptNetwork(true))
                } else if (response.data[i].ref_accessid === 120) {
                  this.$q.sessionStorage.remove('__' + l3s.Encrypt('occupancylineandgrade') + '_token')
                  this.$q.sessionStorage.set('__' + l3s.Encrypt('occupancylineandgrade') + '_token', l3s.EncryptNetwork(true))
                } else if (response.data[i].ref_accessid === 59) {
                  this.$q.sessionStorage.remove('__' + l3s.Encrypt('signage') + '_token')
                  this.$q.sessionStorage.set('__' + l3s.Encrypt('signage') + '_token', l3s.EncryptNetwork(true))
                } else if (response.data[i].ref_accessid === 76) {
                  this.$q.sessionStorage.remove('__' + l3s.Encrypt('electrical') + '_token')
                  this.$q.sessionStorage.set('__' + l3s.Encrypt('electrical') + '_token', l3s.EncryptNetwork(true))
                } else if (response.data[i].ref_accessid === 100) {
                  this.$q.sessionStorage.remove('__' + l3s.Encrypt('mechanical') + '_token')
                  this.$q.sessionStorage.set('__' + l3s.Encrypt('mechanical') + '_token', l3s.EncryptNetwork(true))
                } else if (response.data[i].ref_accessid === 121) {
                  this.$q.sessionStorage.remove('__' + l3s.Encrypt('buildingarchitecture') + '_token')
                  this.$q.sessionStorage.set('__' + l3s.Encrypt('buildingarchitecture') + '_token', l3s.EncryptNetwork(true))
                } else if (response.data[i].ref_accessid === 122) {
                  this.$q.sessionStorage.remove('__' + l3s.Encrypt('occupancyarchitecture') + '_token')
                  this.$q.sessionStorage.set('__' + l3s.Encrypt('occupancyarchitecture') + '_token', l3s.EncryptNetwork(true))
                } else if (response.data[i].ref_accessid === 123) {
                  this.$q.sessionStorage.remove('__' + l3s.Encrypt('buildingstructural') + '_token')
                  this.$q.sessionStorage.set('__' + l3s.Encrypt('buildingstructural') + '_token', l3s.EncryptNetwork(true))
                } else if (response.data[i].ref_accessid === 124) {
                  this.$q.sessionStorage.remove('__' + l3s.Encrypt('occupancystructural') + '_token')
                  this.$q.sessionStorage.set('__' + l3s.Encrypt('occupancystructural') + '_token', l3s.EncryptNetwork(true))
                } else if (response.data[i].ref_accessid === 125) {
                  this.$q.sessionStorage.remove('__' + l3s.Encrypt('buildingsanitaryplumbing') + '_token')
                  this.$q.sessionStorage.set('__' + l3s.Encrypt('buildingsanitaryplumbing') + '_token', l3s.EncryptNetwork(true))
                } else if (response.data[i].ref_accessid === 126) {
                  this.$q.sessionStorage.remove('__' + l3s.Encrypt('occupancysanitaryplumbing') + '_token')
                  this.$q.sessionStorage.set('__' + l3s.Encrypt('occupancysanitaryplumbing') + '_token', l3s.EncryptNetwork(true))
                } else if (response.data[i].ref_accessid === 127) {
                  this.$q.sessionStorage.remove('__' + l3s.Encrypt('buildingelectrical') + '_token')
                  this.$q.sessionStorage.set('__' + l3s.Encrypt('buildingelectrical') + '_token', l3s.EncryptNetwork(true))
                } else if (response.data[i].ref_accessid === 128) {
                  this.$q.sessionStorage.remove('__' + l3s.Encrypt('occupancyelectrical') + '_token')
                  this.$q.sessionStorage.set('__' + l3s.Encrypt('occupancyelectrical') + '_token', l3s.EncryptNetwork(true))
                } else if (response.data[i].ref_accessid === 129) {
                  this.$q.sessionStorage.remove('__' + l3s.Encrypt('buildingmechanical') + '_token')
                  this.$q.sessionStorage.set('__' + l3s.Encrypt('buildingmechanical') + '_token', l3s.EncryptNetwork(true))
                } else if (response.data[i].ref_accessid === 130) {
                  this.$q.sessionStorage.remove('__' + l3s.Encrypt('occupancymechanical') + '_token')
                  this.$q.sessionStorage.set('__' + l3s.Encrypt('occupancymechanical') + '_token', l3s.EncryptNetwork(true))
                } else if (response.data[i].ref_accessid === 131) {
                  this.$q.sessionStorage.remove('__' + l3s.Encrypt('zoning') + '_token')
                  this.$q.sessionStorage.set('__' + l3s.Encrypt('zoning') + '_token', l3s.EncryptNetwork(true))
                } else if (response.data[i].ref_accessid === 132) {
                  this.$q.sessionStorage.remove('__' + l3s.Encrypt('bfp') + '_token')
                  this.$q.sessionStorage.set('__' + l3s.Encrypt('bfp') + '_token', l3s.EncryptNetwork(true))
                }
              }
              const data = JSON.stringify({
                is_online: 1
              })
              this.$axios.put('/api/setOnline' + '/' + (employeeid) + '&data=' + data)

              this.$q.sessionStorage.remove('__' + l3s.Encrypt('employeename') + '_token')
              this.$q.sessionStorage.set('__' + l3s.Encrypt('employeename') + '_token', l3s.EncryptNetwork(fullname))

              this.$q.localStorage.remove('__' + l3s.Encrypt('username') + '_token')
              this.$q.localStorage.set('__' + l3s.Encrypt('username') + '_token', l3s.EncryptNetwork(this.username))
              this.$q.localStorage.remove('__' + l3s.Encrypt('password') + '_token')
              this.$q.localStorage.set('__' + l3s.Encrypt('password') + '_token', l3s.EncryptNetwork(this.dbpassword))
              this.$q.localStorage.remove('__' + l3s.Encrypt('name') + '_token')
              this.$q.localStorage.set('__' + l3s.Encrypt('name') + '_token', l3s.EncryptNetwork(fullname))
              // let jsonize = json.parse(decrypted)
              // let access = jsonize
              // console.log(decrypted)
            })
            // .catch((err) => {
            //   // console.log(err)
            // })

          Swal.fire({
            title: 'WELCOME ' + fullname,
            type: 'success',
            confirmButtonText: 'Proceed',
            background: color
          })
          this.$router.push('main', () => {})
        } else {
          this.$q.loading.hide()
          this.checkDark()
          let color
          if (this.dark) {
            color = '#020110'
          } else {
            color = 'white'
          }
          Swal.fire({
            type: 'error',
            title: 'Invalid Login',
            text: 'Wrong Password',
            background: color
          })
        }
      } else {
        await this.checkConnected()
        const offline = this.offline

        if (offline === false) {
          this.$q.loading.show({
            message: 'Slow Network Detected, Enhancing Network'
          })
          await this.getEmployee()
          this.$q.loading.hide()
          let color
          if (this.dark) {
            color = '#020110'
          } else {
            color = 'white'
          }
          Swal.fire({
            type: 'warning',
            title: 'Enhancement Complete',
            confirmButtonText: 'Retry Login',
            background: color
          })
        } else {
          let color
          if (this.dark) {
            color = '#020110'
          } else {
            color = 'white'
          }

          Swal.fire({
            type: 'error',
            title: 'Cannot Connect to Server',
            confirmButtonText: 'OK',
            background: color
          })
        }
        // let employeeListContent = l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('employeeList') + '_token'))
        // console.log(json.parse(employeeListContent))
      }
    },
    login_offline () {
      const uname = l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('username') + '_token'))
      const pword = l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('password') + '_token'))
      const ename = l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('name') + '_token'))
      const npassword = l3s.Encrypt(this.password)

      if (this.username === uname) {
        if (npassword === pword) {
          this.$q.loading.hide()
          this.checkDark()
          let color
          if (this.dark) {
            color = '#020110'
          } else {
            color = 'white'
          }
          Swal.fire({
            title: 'WELCOME ' + ename,
            type: 'success',
            confirmButtonText: 'Proceed',
            background: color
          })
          this.$router.push('main', () => {})
        } else {
          this.$q.loading.hide()
          this.checkDark()
          let color
          if (this.dark) {
            color = '#020110'
          } else {
            color = 'white'
          }
          Swal.fire({
            type: 'error',
            title: 'Invalid Password',
            background: color
          })
          this.password = ''
        }
      } else {
        this.checkDark()
        let color
        if (this.dark) {
          color = '#020110'
        } else {
          color = 'white'
        }
        Swal.fire({
          type: 'error',
          title: 'Username does not exist',
          background: color
        })
      }
    },
    init () {
      return new Promise((resolve, reject) => {
        const start = true
        if (start) {
          resolve()
        } else {
          reject()
        }
      })
    },
    handler (index) {
      return (props) => {
        this.dark = index

        if (index) {
          this.$q.sessionStorage.remove('__' + l3s.Encrypt('zoning') + '_token')
          this.$q.sessionStorage.set('__' + l3s.Encrypt('dark') + '_token', l3s.EncryptNetwork(true))
        } else {
          this.$q.sessionStorage.remove('__' + l3s.Encrypt('dark') + '_token')
        }
      }
    },
    // login (uname, pword) {
    //   let ePass = l3s.Encrypt(pword)
    //   let jsonize
    //   let decrypted
    //   let ename

    //   this.$q.loading.show()
    //   this.$axios.get('/api/' + l3s.EncryptNetwork('checkUsername') + '/' + l3s.EncryptNetwork(uname))
    //     .then((response) => {
    //       decrypted = l3s.DecryptNetwork(response.data)
    //       jsonize = json.parse(decrypted)
    //       let valid = jsonize[0].Count

    //       if (valid > 0) {
    //         return this.$axios.get('/api/' + l3s.EncryptNetwork('checkPassword') + '/' + l3s.EncryptNetwork(uname))
    //       } else {
    //         this.$q.loading.hide()
    //         this.checkDark()
    //         let color
    //         if (this.dark) {
    //           color = '#020110'
    //         } else {
    //           color = 'white'
    //         }
    //         Swal.fire({
    //           type: 'error',
    //           title: 'Username does not exist',
    //           background: color
    //         })
    //         sessionStorage.removeItem('__' + l3s.Encrypt('id') + '_token')
    //       }
    //     })
    //     .then((response) => {
    //       decrypted = l3s.DecryptNetwork(response.data)
    //       this.epassword = ePass
    //       jsonize = json.parse(decrypted)
    //       this.dbpassword = jsonize[0].password

    //       if (this.epassword === this.dbpassword) {
    //         return this.$axios.get('/api/' + l3s.EncryptNetwork('getEmployeeData') + '/' + l3s.EncryptNetwork(uname))
    //       } else {
    //         this.$q.loading.hide()
    //         this.checkDark()
    //         let color
    //         if (this.dark) {
    //           color = '#020110'
    //         } else {
    //           color = 'white'
    //         }
    //         Swal.fire({
    //           type: 'error',
    //           title: 'Invalid Password',
    //           background: color
    //         })
    //         this.password = ''
    //         sessionStorage.removeItem('__' + l3s.Encrypt('id') + '_token')
    //       }
    //     })
    //     .then((response) => {
    //       decrypted = l3s.DecryptNetwork(response.data)
    //       jsonize = json.parse(decrypted)
    //       this.employeeid = jsonize[0].employeeid
    //       let inspector = jsonize[0].is_inspector
    //       ename = jsonize[0].employeename

    //       if (inspector > 0) {
    //         decrypted = l3s.DecryptNetwork(response.data)
    //         jsonize = json.parse(decrypted)
    //         let isonline = jsonize[0].is_online

    //         if (isonline === 0) {
    //           this.$q.sessionStorage.remove('__' + l3s.Encrypt('id') + '_token')
    //           this.$q.sessionStorage.set('__' + l3s.Encrypt('id') + '_token', l3s.EncryptNetwork(this.employeeid))

    //           return this.$axios.get('/api/' + l3s.EncryptNetwork('getAllAccess') + '/' + l3s.EncryptNetwork(this.employeeid))
    //         } else {
    //           this.$q.loading.hide()
    //           this.checkDark()
    //           let color
    //           if (this.dark) {
    //             color = '#020110'
    //           } else {
    //             color = 'white'
    //           }
    //           Swal.fire({
    //             title: 'Login Failed',
    //             text: 'No Connection on Server',
    //             type: 'error',
    //             confirmButtonText: 'Retry',
    //             background: color
    //           })
    //         }
    //       } else {
    //         this.$q.loading.hide()
    //         this.checkDark()
    //         let color
    //         if (this.dark) {
    //           color = '#020110'
    //         } else {
    //           color = 'white'
    //         }
    //         Swal.fire({
    //           title: 'Invalid Login, Inspectors Only',
    //           type: 'error',
    //           confirmButtonText: 'Proceed',
    //           background: color
    //         })
    //       }
    //     })
    //     .then((response) => {
    //       let decrypted = l3s.DecryptNetwork(response.data)
    //       let jsonize = json.parse(decrypted)
    //       let access = jsonize

    //       this.$axios.get('/api/' + l3s.EncryptNetwork('setOnline') + '/' + l3s.EncryptNetwork(this.employeeid))

    //       for (let i in access) {
    //         if (access[i].ref_accessid === 119) {
    //           this.$q.sessionStorage.remove('__' + l3s.Encrypt('buildinglineandgrade') + '_token')
    //           this.$q.sessionStorage.set('__' + l3s.Encrypt('buildinglineandgrade') + '_token', l3s.EncryptNetwork(true))
    //         } else if (access[i].ref_accessid === 120) {
    //           this.$q.sessionStorage.remove('__' + l3s.Encrypt('occupancylineandgrade') + '_token')
    //           this.$q.sessionStorage.set('__' + l3s.Encrypt('occupancylineandgrade') + '_token', l3s.EncryptNetwork(true))
    //         } else if (access[i].ref_accessid === 59) {
    //           this.$q.sessionStorage.remove('__' + l3s.Encrypt('signage') + '_token')
    //           this.$q.sessionStorage.set('__' + l3s.Encrypt('signage') + '_token', l3s.EncryptNetwork(true))
    //         } else if (access[i].ref_accessid === 76) {
    //           this.$q.sessionStorage.remove('__' + l3s.Encrypt('electrical') + '_token')
    //           this.$q.sessionStorage.set('__' + l3s.Encrypt('electrical') + '_token', l3s.EncryptNetwork(true))
    //         } else if (access[i].ref_accessid === 100) {
    //           this.$q.sessionStorage.remove('__' + l3s.Encrypt('mechanical') + '_token')
    //           this.$q.sessionStorage.set('__' + l3s.Encrypt('mechanical') + '_token', l3s.EncryptNetwork(true))
    //         } else if (access[i].ref_accessid === 121) {
    //           this.$q.sessionStorage.remove('__' + l3s.Encrypt('buildingarchitecture') + '_token')
    //           this.$q.sessionStorage.set('__' + l3s.Encrypt('buildingarchitecture') + '_token', l3s.EncryptNetwork(true))
    //         } else if (access[i].ref_accessid === 122) {
    //           this.$q.sessionStorage.remove('__' + l3s.Encrypt('occupancyarchitecture') + '_token')
    //           this.$q.sessionStorage.set('__' + l3s.Encrypt('occupancyarchitecture') + '_token', l3s.EncryptNetwork(true))
    //         } else if (access[i].ref_accessid === 123) {
    //           this.$q.sessionStorage.remove('__' + l3s.Encrypt('buildingstructural') + '_token')
    //           this.$q.sessionStorage.set('__' + l3s.Encrypt('buildingstructural') + '_token', l3s.EncryptNetwork(true))
    //         } else if (access[i].ref_accessid === 124) {
    //           this.$q.sessionStorage.remove('__' + l3s.Encrypt('occupancystructural') + '_token')
    //           this.$q.sessionStorage.set('__' + l3s.Encrypt('occupancystructural') + '_token', l3s.EncryptNetwork(true))
    //         } else if (access[i].ref_accessid === 125) {
    //           this.$q.sessionStorage.remove('__' + l3s.Encrypt('buildingsanitaryplumbing') + '_token')
    //           this.$q.sessionStorage.set('__' + l3s.Encrypt('buildingsanitaryplumbing') + '_token', l3s.EncryptNetwork(true))
    //         } else if (access[i].ref_accessid === 126) {
    //           this.$q.sessionStorage.remove('__' + l3s.Encrypt('occupancysanitaryplumbing') + '_token')
    //           this.$q.sessionStorage.set('__' + l3s.Encrypt('occupancysanitaryplumbing') + '_token', l3s.EncryptNetwork(true))
    //         } else if (access[i].ref_accessid === 127) {
    //           this.$q.sessionStorage.remove('__' + l3s.Encrypt('buildingelectrical') + '_token')
    //           this.$q.sessionStorage.set('__' + l3s.Encrypt('buildingelectrical') + '_token', l3s.EncryptNetwork(true))
    //         } else if (access[i].ref_accessid === 128) {
    //           this.$q.sessionStorage.remove('__' + l3s.Encrypt('occupancyelectrical') + '_token')
    //           this.$q.sessionStorage.set('__' + l3s.Encrypt('occupancyelectrical') + '_token', l3s.EncryptNetwork(true))
    //         } else if (access[i].ref_accessid === 129) {
    //           this.$q.sessionStorage.remove('__' + l3s.Encrypt('buildingmechanical') + '_token')
    //           this.$q.sessionStorage.set('__' + l3s.Encrypt('buildingmechanical') + '_token', l3s.EncryptNetwork(true))
    //         } else if (access[i].ref_accessid === 130) {
    //           this.$q.sessionStorage.remove('__' + l3s.Encrypt('occupancymechanical') + '_token')
    //           this.$q.sessionStorage.set('__' + l3s.Encrypt('occupancymechanical') + '_token', l3s.EncryptNetwork(true))
    //         } else if (access[i].ref_accessid === 131) {
    //           this.$q.sessionStorage.remove('__' + l3s.Encrypt('zoning') + '_token')
    //           this.$q.sessionStorage.set('__' + l3s.Encrypt('zoning') + '_token', l3s.EncryptNetwork(true))
    //         } else if (access[i].ref_accessid === 132) {
    //           this.$q.sessionStorage.remove('__' + l3s.Encrypt('bfp') + '_token')
    //           this.$q.sessionStorage.set('__' + l3s.Encrypt('bfp') + '_token', l3s.EncryptNetwork(true))
    //         }
    //         this.$q.sessionStorage.remove('__' + l3s.Encrypt('employeename') + '_token')
    //         this.$q.sessionStorage.set('__' + l3s.Encrypt('employeename') + '_token', l3s.EncryptNetwork(ename))

    //         this.$q.loading.hide()
    //         this.checkDark()
    //         let color
    //         if (this.dark) {
    //           color = '#020110'
    //         } else {
    //           color = 'white'
    //         }
    //         Swal.fire({
    //           title: 'WELCOME ' + ename,
    //           type: 'success',
    //           confirmButtonText: 'Proceed',
    //           background: color
    //         })
    //         this.$router.push('main')
    //         // .catch((err) => { console.error(err) })
    //       }
    //     })
    //     .catch(() => {
    //       this.$q.loading.hide()
    //       this.checkDark()
    //       let color
    //       if (this.dark) {
    //         color = '#020110'
    //       } else {
    //         color = 'white'
    //       }
    //       Swal.fire({
    //         type: 'error',
    //         title: 'No Connection on Server',
    //         background: color
    //       })
    //       sessionStorage.removeItem('__' + l3s.Encrypt('id') + '_token')
    //     })
    // },
    nightmode (bool) {
      this.dark = bool
      if (bool) {
        this.$q.sessionStorage.remove('__' + l3s.Encrypt('zoning') + '_token')
        this.$q.sessionStorage.set('__' + l3s.Encrypt('dark') + '_token', l3s.EncryptNetwork(true))
      } else {
        this.$q.sessionStorage.remove('__' + l3s.Encrypt('dark') + '_token')
      }
    },
    forgotPassword () {
      Swal.fire({
        type: 'info',
        title: 'Please Contact the IT Team'
      })
    }
  },
  created () {
    this.init()
      .then(this.checkLogin())
      .then(this.checkDark())

    // window.addEventListener('beforeunload', () => {
    //   event.returnValue = `Are you sure you want to leave?`
    // })

    // this.$axios.get('/api/' + l3s.EncryptNetwork('checkConnected') + '/' + l3s.EncryptNetwork('1'))
    //   .then((response) => {
    //     let decrypted = l3s.DecryptNetwork(response.data)
    //     let jsonize = json.parse(decrypted)
    //     this.one = jsonize[0].one
    //     console.log(jsonize[0])
    //     this.offline = false
    //   })
    //   .catch((err) => {
    //     this.offline = true
    //     console.error(err)
    //   })
  },
  mounted () {
    this.intro()
      .then(this.getEmployee())
    // .then(this.getAllBuilding())
    // .then(this.getAllDocflow())
      .then(this.animate())
      .catch((err) => {
        Swal.fire({
          text: err,
          type: 'error',
          confirmButtonText: 'Retry'
        })
      })
  },
  beforeDestroy () {
    // this.$q.localStorage.clear()
  }
}
</script>

<style scoped>
  .grid-container {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    grid-template-areas: "online-notify main mode";
  }

  .online-notify { grid-area: online-notify; }

  .main {
    grid-area: main;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
  }

  .mode {
    grid-area: mode;
    /* position: absolute; */
    /* padding-left: 90%; */
  }

  .page-title {
    margin-top: -21px;
    font-weight: bold;
    /* text-shadow: 2px 2px 2px #031a23; */
    /* -webkit-text-stroke: white; */
    /* -webkit-text-stroke-width: 0.5px;
    -webkit-text-stroke-color: #000000; */
  }

  .logo {
    margin-top: 5px;
    width: 250px;
    height: 250px;
  }

  .logo2 {
    margin-top: -55px;
    width: 200px;
    height: 200px;
  }

  .logoglow {
    margin-top: -35px;
    width: 200px;
  }

  /* .davaologo {
    margin-top: -55px;
    padding: 30px;
    background-color: white;
  } */

  .docs {
    color: #ffbe00;
    cursor: pointer;
    margin-top: -1.6em;
    padding-bottom: 1em;
    text-decoration: underline;
    font-size: 1.2em;
  }

  .davaologo {
    margin-top: 25px;
  }

  .form-light {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;

    -webkit-border-radius: 18px;
    -moz-border-radius: 18px;
    border-radius: 18px;

    -webkit-box-shadow: 9px 9px 15px rgb(96, 113, 145);
    -moz-box-shadow: 9px 9px 15px rgb(96, 113, 145);
    box-shadow: 9px 9px 15px rgb(96, 113, 145);
    /* border: 5px solid #001628; */
    /* border: 5px solid #4A8EFE; */
    /* border: 5px solid #031a23; */
    width: 500px;
    height: 300px;
    margin: 30px;
    margin-top: -10px;
    /* background: linear-gradient(180deg,#39485a,#293441 30%,#192129 51%,#192330); */
    /* background: linear-gradient(180deg,#FDFDFE,#BBD4FE 30%,#87B4FE 51%,#4A8EFE); */
    background: #ffffff;
    /* box-shadow: 2px 2px 50px #031a23; */
  }

  .form-dark {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;

    -webkit-border-radius: 18px;
    -moz-border-radius: 18px;
    border-radius: 18px;

    -webkit-box-shadow: 9px 9px 15px rgb(41, 41, 41);
    -moz-box-shadow: 9px 9px 15px rgb(41, 41, 41);
    box-shadow: 9px 9px 15px rgb(41, 41, 41);

    background: #000000;

    width: 500px;
    height: 300px;
    margin: 30px;
    margin-top: -10px;
  }

  .form-title {
    -webkit-border-radius: 40px;
    -moz-border-radius: 40px;
    align-items: center;
    align-content: center;
    background-color: #031a23;
    border-radius: 40px;
    color: #FDFDFE;
    /*display: inline;*/
    justify-content: center;
    margin: -20px 0 0 0;
    padding: 10px 20px 10px 20px;
    text-align: center;
    display: none;
    /* color: #f5d67b;
    background-color: #192129; */
    /* width: 20%;
    height: 30px; */
    /* margin-top: -15px; */
  }

  .textbox {
    width: 90%;
    /* color: #3f51b5; */
    text-transform: uppercase;
  }

  .qButton {
    margin-top: 3em;
    /* width: 150px;
    height: 50px; */
    width: 180px;
    height: 40px;
  }

  .br {
    height: 40px;
  }

  /* .workArea {
    align-items: center;
    align-content: center;
    background-image: url("public\statics\blueprint.jpg");
    background-size: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    height: 100%;
  } */

  .workArea {
    align-items: center;
    align-content: center;
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    /* position: relative;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start; */
  }

  .workArea::before {
    background-image: url("../assets/bg.svg");
    background-color:lightslategray; /*  rgb(28, 28, 29) */
    background-blend-mode: multiply;
    background-size: cover;
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    opacity: 0.9;
    /* opacity: 0.8; */
  }

  .workArea-dark {
    align-items: center;
    align-content: center;
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    /* position: relative;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start; */
  }

  .workArea-dark::before {
    background-image: url("../assets/bg.svg");
    background-color: rgb(28, 28, 29);
    background-blend-mode: multiply;
    background-size: cover;
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    opacity: 0.9;
  }

  .h1-light {
    color: #FFFFFF;
    font-weight: bold;
    margin-bottom: -30px;
    text-transform: uppercase;
    text-emphasis: auto;
  }

  .h1-dark {
    color: #000000;
    font-weight: bold;
    margin-bottom: -30px;
    text-transform: uppercase;
    text-emphasis: auto;
  }

  .h2-light {
    color: #ffbe00;
    /* color: #ffffff; */
    text-transform: uppercase;
  }

  .h2-dark {
    color: black;
    text-transform: uppercase;
    /* text-shadow: 2px 2px 5px #FFF; */
  }

  /* footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    color: white;
    -moz-text-stroke: 0.5px red;
    -webkit-text-stroke: 0.5px red;
    text-align: center;
  } */

  footer {
    color: #ffbe00;
    font-size: 0.9rem;
  }

  /* @media screen and (min-width: 900px) { */
  @media screen and (max-width: 900px) {
    .grid-container {
      display: grid;
      grid-template-columns: 1fr 3fr 1fr;
      grid-template-areas: "online-notify main mode";
    }

    .mode {
      grid-area: mode;
      display: none;
    }

    .form-light {
      width: 300px;
      margin-top: 80px;
    }

    .form-dark {
      width: 300px;
      margin-top: 80px;
    }

    .logo {
      width: 195px;
      height: 195px;
    }

    .logo2 {
      width: 150px;
      height: 150px;
    }

    .page-title {
      display: none;
    }
  }

  @media screen and (max-width: 1045px) {
    .page-title {
      font-size: 3.1em;
    }

    .mode {
      display: none;
    }
  }
</style>
