<template>
  <q-page padding class="page">
    <div class="grid-container">
      <div class="title">
        <span>How to Install from Chrome</span>
      </div>

      <div class="step1 step">
        <span class="para">Step 1</span>
        <br/>
        <img class="photo" src="../../assets/chrome-mobile/1.jpg" alt="Step 1"/>
      </div>

      <div class="step2 step">
        <span class="para">Step 2</span>
        <br/>
        <img class="photo" src="../../assets/chrome-mobile/2.jpg" alt="Step 2"/>
      </div>

      <div class="step3 step">
        <span class="para">Step 3</span>
        <br/>
        <img class="photo" src="../../assets/chrome-mobile/3.jpg" alt="Step 3"/>
      </div>

      <div class="step4 step">
        <span class="para">Step 4</span>
        <br/>
        <img class="photo" src="../../assets/chrome-mobile/4.jpg" alt="Step 4"/>
      </div>

      <div class="step5 step">
        <span class="para">Step 5</span>
        <br/>
        <img class="photo" src="../../assets/chrome-mobile/5.jpg" alt="Step 5"/>
      </div>

      <div class="step6 step">
        <span class="para">Step 6</span>
        <br/>
        <img class="photo" src="../../assets/chrome-mobile/6.jpg" alt="Step 6"/>
      </div>

      <div class="step7 step">
        <span class="para">Step 7</span>
        <br/>
        <img class="photo" src="../../assets/chrome-mobile/7.jpg" alt="Step 7"/>
      </div>

      <div class="step8 step">
        <span class="para">Step 8</span>
        <br/>
        <img class="photo" src="../../assets/chrome-mobile/8.jpg" alt="Step 8"/>
      </div>

      <div class="step9 step">
        <span class="para">Step 9</span>
        <br/>
        <img class="photo" src="../../assets/chrome-mobile/9.jpg" alt="Step 9"/>
      </div>

      <div class="button step">
        <q-btn unelevated class="doc-button" color="primary" @click="goBack" size="lg">Back</q-btn>
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
      this.$router.push('docs/2', () => {})
    }
  }
}
</script>

<style scoped>
  .page {
    height: 570vh;
  }

  grid-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    gap: 1px 1px;
    grid-template-areas: "title step1" "step2" "step3" "step4" "step5" "step6" "step7" "step8" "step9" "button";
  }

  .step1 { grid-area: step1; }
  .step2 { grid-area: step2; }
  .step3 { grid-area: step3; }
  .step4 { grid-area: step4; }
  .step5 { grid-area: step5; }
  .step6 { grid-area: step6; }
  .step7 { grid-area: step7; }
  .step8 { grid-area: step8; }
  .step9 { grid-area: step9; }

  .step {
    width: 100%;
    text-align: center;
    margin-top: 2em;
  }

  .title {
    grid-area: title;
    width: 100%;
    text-align: center;
    font-weight: bold;
    font-size: 1.1em;
    color: #ffbe00;
    margin-bottom: 2em;
  }

  .para {
    font-size: 1.1em;
    color: #ffbe00;
  }

  .photo {
    width: 12em;
  }

  .doc-button {
    grid-area: button;
    width: 9em;
  }

  @media screen and (min-width: 580px) {
    .page {
      height: 210vh;
    }

    .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 0.1fr 1fr 1fr 1fr 0.2fr;
      gap: 1px 1px;
      grid-template-areas: "title title title" "step1 step2 step3" "step4 step5 step6" "step7 step8 step9" ". button .";
    }

    .step1 { grid-area: step1; }
    .step2 { grid-area: step2; }
    .step3 { grid-area: step3; }
    .step4 { grid-area: step4; }
    .step5 { grid-area: step5; }
    .step6 { grid-area: step6; }
    .step7 { grid-area: step7; }
    .step8 { grid-area: step8; }
    .step9 { grid-area: step9; }

    .title {
      grid-area: title;
      font-weight: bold;
      font-size: 2em;
      color: #ffbe00;
      margin-bottom: -3em;
    }

    .para {
      font-size: 1.3em;
    }

    .step {
      width: 100%;
      text-align: center;
      margin-top: 2em;
    }

    .button {
      grid-area: button;
    }

    .doc-button {
      width: 12em;
    }
  }

  @media screen and (min-width: 1280px) {
    .para {
      font-size: 1.5em;
    }
  }
</style>
