<template>
  <q-page padding class="page">
   <q-carousel swipeable arrows animated transition-next="slide-left" transition-prev="slide-right" thumbnails infinite v-model="slide">
     <q-carousel-slide :name="1" :img-src="image"/>
   </q-carousel>
  </q-page>
</template>

<script>
// const l3s = require('../assets/js/L3S')

export default {
  data () {
    return {
      slide: 1,
      image: null
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
      // const images = (this.$q.sessionStorage.getItem('images'))
      // const b64 = Base64.decode(images)
      // console.log('b64 decode: ', b64)
      // this.image = b64
      // const images = l3s.DecryptNetwork(this.$q.sessionStorage.getItem('__' + l3s.Encrypt('images') + '_token'))
      // console.log(images.length)
      // this.image = images
    }
  },
  created () {
    this.intro()
      .then(this.loadImages())
  }
}
</script>
