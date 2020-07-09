<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
/* import { openURL } from 'quasar' */
import { Encrypt } from '../assets/js/L3S'
/* import { id } from 'vuex' */

export default {
  name: 'MainLayout',
  data () {
    return {
      /* leftDrawerOpen: false,
      logged: false */
    }
  },
  methods: {
    /* openURL, */
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
