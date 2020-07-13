<template>
  <q-page padding class="page">
    <div class="grid-container">
      <div class="text">
        <span class="para">Technologies behind this Application</span>
      </div>

      <div class="logos">
          <a>
            <img class="logo" src="../../assets/logos/html-5.svg" alt="HTML5"/>
            <q-tooltip content-class="bg-black" content-style="font-size: 14px">HTML5</q-tooltip>
          </a>
          <a>
            <img class="logo" src="../../assets/logos/css-3.svg" alt="CSS3"/>
            <q-tooltip content-class="bg-black" content-style="font-size: 14px">CSS3</q-tooltip>
          </a>
          <a>
            <img class="logo" src="../../assets/logos/javascript.svg" alt="Javascript"/>
            <q-tooltip content-class="bg-black" content-style="font-size: 14px">Javascript</q-tooltip>
          </a>
          <a>
            <img class="node" src="../../assets/logos/nodejs.svg" alt="NodeJS"/>
            <q-tooltip content-class="bg-black" content-style="font-size: 14px">NodeJS</q-tooltip>
          </a>
          <a>
            <img class="logo" src="../../assets/logos/vue-js-1.svg" alt="VueJS"/>
            <q-tooltip content-class="bg-black" content-style="font-size: 14px">VueJS</q-tooltip>
          </a>
          <a>
            <img class="logo" src="../../assets/logos/material-ui-1.svg" alt="Material Design"/>
            <q-tooltip content-class="bg-black" content-style="font-size: 14px">Material Design</q-tooltip>
          </a>
          <a>
            <img class="logo" src="../../assets/logos/webpack-icon.svg" alt="Webpack"/>
            <q-tooltip content-class="bg-black" content-style="font-size: 14px">Webpack</q-tooltip>
          </a>
          <a>
            <img class="logo" src="../../assets/logos/pwa-logo.svg" alt="PWA"/>
            <q-tooltip content-class="bg-black" content-style="font-size: 14px">PWA</q-tooltip>
          </a>
      </div>

      <div class="button">
        <!--<q-btn unelevated class="doc-button" color="primary" @click="goBack" size="lg">Back</q-btn>-->
        <q-btn flat rounded color="white" size="lg" class="back" @click="goBack">Back</q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data () {
    return {}
  },
  methods: {
    goBack () {
      this.$router.push('/docs/2', () => {})
    }
  }
}
</script>

<style scoped lang="stylus">
  .grid-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 1px 1px;
    grid-template-areas: "text" "logos" "button";
  }

  .text
    grid-area: text
    width: 100%
    text-align: center
    font-weight: bold
    font-size: 1.1em
    color: #ffbe00

  .logos
    grid-area: logos
    padding: 1.1em
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
    margin-top: -3.8em

  .button
    grid-area: button
    margin-top: 2em
    margin-bottom: -0.1em
    height: 3.2em
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;

  .logo
    width: 4em
    height: 4em
    margin-top: 0
    margin-left: 0.8em

  .node
    width: 7em
    height: 3em
    margin: 0.5em

  .doc-button
    width: 6em

  @media screen and (min-width: 580px)
    .logo
      width: 6em
      height: 6em
      margin: 0.7em

    .node
      width: 9em
      height: 5em
      margin: 0.5em

    .text
      font-size: 1.5em

    .doc-button
      width: 8em

  @media screen and (min-width: 1280px)
    .logo
      width: 7em
      height: 7em
      margin: 0.8em

    .node
      width: 10em
      height: 5.2em
      margin: 0.5em

    .text
      font-size: 2em

    .doc-button
      width: 10em
</style>
