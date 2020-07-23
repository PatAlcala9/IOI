<template>
  <q-page padding class="page">
   <q-carousel swipeable arrows animated transition-next="slide-left" transition-prev="slide-right" thumbnails infinite v-model="slide">
     <q-carousel-slide :name="1" img-src="../assets/001.jpg" />
     <q-carousel-slide :name="2" img-src="../assets/002.jpg" />
     <q-carousel-slide :name="3" img-src="../assets/003.jpg" />
     <q-carousel-slide :name="4" img-src="../assets/004.jpg" />
   </q-carousel>
  </q-page>
</template>

<script>

export default {
  // name: 'PageName',
  data () {
    return {
      slide: 1
    }
  }
}
</script>
