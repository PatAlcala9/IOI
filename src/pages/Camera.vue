<template>
  <q-page padding class="page column">
    <label v-if="error" class="col self-center">Cannot Load Camera</label>

    <!-- <div class="col self-center">
      <video id="player" autoplay></video>
      <canvas id="canvas"></canvas>
    </div> -->

    <input id="camera" class="camera" type="file" accept="image/*" capture="camera" hidden/>
    <q-btn color="primary" label="Add Photo" @click="openCamera"/>

    <!-- <q-btn id="capture" color="primary" label="Capture" /> -->
  </q-page>
</template>

<script>
// import camerakit from 'camerakit'
// const canvas = document.getElementById('canvas')
// const context = canvas.getContext('2d')
// const captureButton = document.getElementById('capture')

export default {
  name: 'PageCamera',
  data () {
    return {
      error: false
    }
  },
  mounted () {
    // this.init()
  },
  methods: {
    init () {
      const constraints = {
        video: {
          width: {
            ideal: 900
          },
          height: {
            ideal: 600
          },
          facingMode: {
            exact: 'environment'
          }
        },
        audio: false
      }
      const player = document.getElementById('player')
      // const canvas = document.getElementById('canvas')

      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          // track = stream.getTracks()[0]
          player.srcObject = stream
          this.error = false
        })
        .catch(() => {
          this.error = true
        })
    },
    openCamera () {
      document.getElementById('camera').click()
    }
  }
}
</script>

<style scoped lang="stylus">
  .flex
    display: flex
    flex-direction: column
    flex-wrap: wrap
    justify-content: space-between
    align-content: center

  .page
    align-items: center
    align-content: center
    width: 100%
    height: 65vw
    min-width: 100%
    min-height: 100%

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
    opacity: 0.9

  // .camera::-webkit-file-upload-button
  //   display: none

  // .camera::before
  //   content: 'Select some files'
  //   display: inline-block
  //   background: blue
  //   border: 1px solid #999
  //   border-radius: 3px
  //   padding: 5px 8px
  //   outline: none
  //   white-space: nowrap
  //   -webkit-user-select: none
  //   cursor: pointer
  //   text-shadow: 1px 1px #fff
  //   font-weight: 700
  //   font-size: 10pt

  // .camera:hover::before
  //   border-color: black

  // .camera:active::before
  //   background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9)

</style>
