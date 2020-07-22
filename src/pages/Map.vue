<template>
  <q-page padding class="page">
    <div class="fit row no-wrap justify-between  content-start">
      <q-btn flat rounded class="button4 doc-button" size="lg" color="white" @click="goBack">Back</q-btn>
      <h4>OCBO Map</h4>
    </div>

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
    goBack () {
      this.$router.push('/main', () => {})
      location.reload(true)
    }
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

  h4
    margin: 0.1em
    padding-bottom: 0.1em
    color: #ffbe00
    text-transform: uppercase
    font-weight: bold
</style>
