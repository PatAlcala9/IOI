<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { Encrypt } from '../assets/js/L3S'
/* import { id } from 'vuex' */

export default {
  name: 'MainLayout',
  data () {
    return {}
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
    }
  },
  created () {
    this.checkLogin()
  }
}

</script>

<style>
</style>
