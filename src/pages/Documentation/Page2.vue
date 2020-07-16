<template>
  <q-page padding class="page">

        <div class="q-pa-md">
          <div class="column">
            <div class="col">
              <div class="pageTitle">
                <a class="dot">- </a>
                <a class="text">Ease of Use </a>
                <a class="dot">- </a>
                <a class="text">Fast </a>
                <a class="dot">- </a>
                <a class="text">Secure </a>
                <a class="dot">-</a>
              </div>

            </div>
            <div class="col">
              <p class="para">
                <a class="para-title text content">IIPS Online Inspection </a>
                <a class="para text content">is a web application that primarily designed for mobile use. it behaves and feels like a mobile application, hence some features are built for mobile use.</a>
              </p>
            </div>

            <div class="col">
              <p class="para">
                <span class="para-title text content">Mobile App Convertable</span>
                <span class="para text content">. it is easily convertable into a mobile application using native mobile browsers (Google Chrome, Mozilla Firefox, Apple Safari, Opera, Brave, etc). No download and/or installation needed. You simply load it from a browser and "Add to Home screen". Normally this would create a shortcut, but in this case the shortcut created will behave like a full feature mobile app which can be access even without internet. For visual guide <a class="link" @click="goVisual">click here</a></span>
              </p>
            </div>

            <div class="col">
              <p class="para">
                <span class="para-title text content">Recommended Browser</span>
                <span class="para text content">. Although it will work on any browser, for each platform there is a recommended browser for best experience.</span>
                <br/>
                <span class="para-list">PC : </span>
                <span class="para-list-content text">Any Browser (except Internet Explorer & Microsoft Edge)</span>
                <br/>
                <span class="para-list">MacOS : </span>
                <span class="para-list-content text">Any Browser</span>
                <br/>
                <span class="para-list">Android Phone : </span>
                <span class="para-list-content text">Google Chrome</span>
                <br/>
                <span class="para-list">iPhone : </span>
                <span class="para-list-content text">Apple Safari</span>
                <br/>
                <span class="para-list">Android Tablet : </span>
                <span class="para-list-content text">Google Chrome</span>
                <br/>
                <span class="para-list">iPad : </span>
                <span class="para-list-content text">Apple Safari</span>
              </p>
            </div>

            <div class="col">
              <div class="grid">
                <q-btn unelevated class="button1 doc-button" size="lg" color="primary" label="How to Use" @click="nextPage">
                  <q-tooltip content-class="bg-black" content-style="font-size: 16px">For users</q-tooltip>
                </q-btn>
                <q-btn unelevated class="button2 doc-button" size="lg" color="primary" label="Security Details" @click="openSecurity">
                  <q-tooltip content-class="bg-black" content-style="font-size: 16px">For more info about Security</q-tooltip>
                </q-btn>
                <q-btn unelevated class="button3 doc-button" size="lg" color="primary" label="Technical Info" @click="openTechnical">
                  <q-tooltip content-class="bg-black" content-style="font-size: 16px">For curios people</q-tooltip>
                </q-btn>

                <!--<q-btn unelevated class="button4 doc-button" size="lg" color="primary" label="Back" @click="goBack">
                  <q-tooltip content-class="bg-black" content-style="font-size: 16px">Return to Main Documentation Page</q-tooltip>
                </q-btn>-->
                <q-btn flat rounded class="button4 doc-button" size="lg" color="white" label="Back" @click="goBack">
                  <q-tooltip content-class="bg-black" content-style="font-size: 16px">Return to the Application</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </div>

  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data () {
    return {
      screenWidth: null
    }
  },
  created () {
    this.init()
      .then(this.checkUnit())
  },
  mounted () {
    this.screenListener()
  },
  methods: {
    init () {
      return new Promise((resolve, reject) => {
        const load = true
        if (load) {
          resolve()
        } else {
          reject()
        }
      })
    },
    screenListener () {
      window.addEventListener('resize', () => {
        this.screenWidth = window.innerWidth
      })
    },
    popup () {
      this.$q.notify({
        message: 'The Page for Visual Guide is Under Construction',
        color: '#607d8b',
        position: 'center',
        timeout: '2000'
      })
    },
    goVisual () {
      this.$router.push('/mobile', () => {})
    },
    openTechnical () {
      this.$router.push('/info/tech', () => {})
    },
    goBack () {
      this.$router.push('/', () => {})
    },
    nextPage () {
      this.$router.push('/docs/3', () => {})
    },
    openSecurity () {
      this.$router.push('/info/secs', () => {})
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.screenListener)
  }
}
</script>

<style scoped>
  .workArea {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-areas: "main";
  }

  .main {
    grid-area: main;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
  }

  .tabTitle {
    margin: auto;
  }

  .pageTitle {
    width: 100%;
    text-align: center;
    margin: auto;
  }

  .para {
    width: 100%;
    text-align: justify;
    margin-top: 2em;
  }

  .para-list {
    color: #ffbe00;
    padding-left: 2em;
    font-weight: bold;
    text-align: left;
  }

  .para-list-content {
    width: 100%;
    text-align: left;
    margin-top: 1em;
  }

  .text {
    /*color: #ffbe00;*/
    color: white;
  }

  .para-title {
    font-weight: bold;
    font-size: 1.1em;
    color: #ffbe00;
  }

  .dot {
    font-weight: bold;
    color: #ffbe00;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 1.3em;
  }

  .link {
    font-weight: bold;
    color: #ffbe00;
    cursor: pointer;
    text-decoration: #ffbe00 underline;
  }

  .doc-button {
   /* margin-top: 2em;
    margin-bottom: -0.1em;
    height: 3.2em;*/
    margin-top: 2em;
    margin-bottom: -0.6em;
  }

  /* Phone Screen */
  @media screen and (min-width: 0px) {
    .pageTitle {
      font-size: 1.3em;
    }

    .page {
      height: 160vh;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr 1fr 1fr;
      gap: 1px 1px;
      grid-template-areas: "button1" "button2" "button3" "button4";
    }

    .button1 {
      grid-area: button1;
    }
    .button2 {
      grid-area: button2;
    }
    .button3 {
      grid-area: button3;
    }
    .button4 {
      grid-area: button4;
    }
  }

 /* Tablet Screen */
  @media screen and (min-width: 580px) {
    .pageTitle {
      font-size: 2em;
    }

    .text {
      font-size: 1.2em;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr;
      gap: 1px 1px;
      grid-template-areas: "button1 button2 button3" ". button4 .";
    }

    .button1 { grid-area: button1; }
    .button2 { grid-area: button2; }
    .button3 { grid-area: button3; }
    .button4 { grid-area: button4; }

    .doc-button {
      margin: 1em;
    }

    .para-list {
      font-size: 1.2em;
    }
  }

 /* @media screen and (min-width: 1180px) {
    .doc-button {
      font-size: 1em;
      width: 10em;
      margin: 2em;
    }
  }*/

  /* PC Screen */
  @media screen and (min-width: 1280px) {
    .pageTitle {
      font-size: 2.8em;
    }

    .text {
      font-size: 1.5em;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr;
      gap: 1px 1px;
      grid-template-areas: "button1 button2 button3" " . button4 . ";
    }

    .button1 { grid-area: button1; }
    .button2 { grid-area: button2; }
    .button3 { grid-area: button3; }
    /*.button4 { grid-area: button4; } */

    .button4 {
      grid-area: button4;
      margin-top: -5em;
    }

    .doc-button {
      margin-left: 3.1em;
      margin-top: 2em;
      width: 15em
    }

    .para-list {
      font-size: 1.5em;
    }
  }
</style>
