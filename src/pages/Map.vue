<template>
  <q-page padding class="page">
    <h4>OCBO Map</h4>
    <imap></imap>
  </q-page>
</template>

<script>
export default {
  // name: 'Map',
  components: {
    imap: () => import('../components/map')
  },
  data () {},
  methods: {
    /* init () {
      return new Promise((resolve, reject) => {
        const start = true
        if (start) {
          resolve()
        } else {
          reject()
        }
      })
    } */
  }
}
</script>

<style scoped lang="stylus">
  .page
    grid-area: main;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    width: 100%
    height: 100%
    min-width: 100%
    min-height: 100%
    position: relative

  /*
    .page::before
      background-image: url("../assets/bg.svg")
      background-color: lightslategray
      background-blend-mode: multiply
      background-size: cover
      content: ""
      display: block
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -2
      opacity: 0.9*/

  h4
    margin: 0.1em
    padding-bottom: 0.1em
    color: #ffbe00
    text-transform: uppercase
    font-weight: bold
</style>
