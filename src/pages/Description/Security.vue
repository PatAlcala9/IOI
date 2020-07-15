<template>
  <q-page padding class="page">
    <div class="q-pa-md">
        <div class="column">
          <div class="col">
            <div class="pageTitle">
              <span class="text title">Security</span>
            </div>
          </div>

          <div class="col">
            <p class="para">
              <span class="para-title">Security </span>
              <span class="text">is the most difficult part of any application. Making an application work is easy, but making it work securely is a challenge.</span>
            </p>
          </div>

          <div class="col">
            <p class="para">
              <span class="para-title">The best way </span>
              <span class="text">to do that is to think like a hacker, you don't need to be one but just to think like one. Because it's hard to fight an enemy if you don't know their strategy.</span>
            </p>
          </div>

          <div class="col">
            <p class="para">
              <span class="para-title">Luckily</span>
              <span class="text">, there's OWASP to help, it stands for "Open Web Application Security Project". It is a community that helps every programmer around the world to build a secure application. They enlist every possible method a hacker or an attacker might perform.</span>
            </p>
          </div>

          <div class="col">
            <div class="fit column wrap justify-center items-center content-center button-wrapper">
              <q-btn unelevated class="doc-button" size="lg" color="primary" label="Proceed" @click="nextPage">
                <q-tooltip content-class="bg-black" content-style="font-size: 16px">Find out about Security of IIPS</q-tooltip>
              </q-btn>

              <q-btn flat rounded class="extra-space doc-button" color="white" size="lg" label="Back" @click="backPage">
                <q-tooltip content-class="bg-black" content-style="font-size: 16px">Go Back to Main Documentation Page</q-tooltip>
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
    return {}
  },
  methods: {
    nextPage () {
      this.$router.push('/info/secs/2', () => {})
    },
    backPage () {
      this.$router.push('/docs/2', () => {})
    }
  }
}
</script>

<style scoped>
  .pageTitle {
    width: 100%;
    text-align: center;
    margin: auto;
  }

  .para-title {
    font-weight: bold;
    font-size: 1.1em;
    color: #ffbe00;
  }

  .text {
    color: white;
  }

  .title {
    color: #ffbe00;
    font-size: 2.5rem;
  }

  .para {
    width: 100%;
    text-align: justify;
    margin-top: 2em;
  }

  .doc-button {
   /* margin-top: 2em;
    margin-bottom: -0.1em;
    height: 3.2em;*/
  }

  .button-wrapper {
    margin-top: 3rem;
  }

  .extra-space {
    margin-top: 0.8rem;
  }

  .page {
    height: 105vh;
  }

  @media screen and (min-width: 580px) {
    .pageTitle {
      font-size: 3.2em;
    }

    .text {
      font-size: 1.2em;
    }

    .para-title {
      font-size: 1.3em;
    }

    .button-wrapper {
      margin-top: 5rem;
    }

    .doc-button {
      width: 10rem;
    }
  }

  @media screen and (min-width: 1280px) {
    .pageTitle {
      font-size: 3.8em;
    }

    .text {
      font-size: 1.5em;
    }

    .para-title {
      font-size: 1.6em;
    }
  }
</style>
