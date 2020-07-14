<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { Encrypt } from '../assets/js/L3S'
/* import { getWorkerInstance } from 'app/src-pwa/custom-service-worker' */
/* import { id } from 'vuex' */

export default {
  name: 'MainLayout',
  data () {
    return {
      installPrompt: null
    }
  },
  methods: {
    checkLogin () {
      if (this.$q.sessionStorage.has('__' + Encrypt('id') + '_token') === true) {
        // this.$router.push('main')
        this.logged = true
      } else {
        // this.$router.push('/')
        this.logged = false
      }
    },
    logout () {
      this.$q.sessionStorage.remove('__' + Encrypt('id') + '_token')
      window.location.reload(false)
    },
    registerSW () {
      getWorkerInstance().then(workerInstance => {
        this.worker = workerInstance.active
      })
    },
    install () {
      this.initInstall.prompt()
    },
    initInstall () {
      window.addEventListener('beforeinstallprompt', (e) => {
        this.initInstall = e
      })
    }
  },
  created () {
    this.checkLogin()
    this.registerSW()
  },
  mounted () {
    this.initInstall()
  }
}

</script>

<style>
</style>
