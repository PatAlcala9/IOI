<template>
  <q-page padding class="page">
   <q-carousel swipeable arrows animated transition-next="slide-left" transition-prev="slide-right" thumbnails infinite v-model="slide">

   </q-carousel>
  </q-page>
</template>

<script>
const l3s = require('../assets/js/L3S')

export default {
  data () {
    return {
      slide: 1
    }
  },
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
    async loadImages () {
      const images = await l3s.DecryptNetwork(this.$q.sessionStorage.getItem('images'))
      console.log(images)
    }
  },
  created () {
    this.intro()
      .then(this.loadImages())
  }
}
</script>
