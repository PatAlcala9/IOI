<template>
  <q-page padding class="page">
    <div class="q-pa-md">
      <div class="column">
        <div class="col">
          <div class="pageTitle">
            <span class="text title">IOI Security</span>
          </div>
        </div>

        <div class="col">
          <p class="para">
            <span class="para-title">IIPS Online Inspection </span>
            <span class="text">is secured by the following:</span>
          </p>
        </div>

        <div class="col">
          <p class="para">
            <span class="para-title">End-to-End Encryption. </span>
            <span class="text">This ensures that the data sent across the network is unreadable. This prevents the hacker from performing an attack called Man-in-the-Middle. Making it harder to alter data.</span>
          </p>
        </div>

        <div class="col">
          <p class="para">
            <span class="para-title">Data Lock </span>
            <span class="text">is a custom HTTP Security Header that serve it own purpose. It locks the data sent across the network preventing alteration until it reach the database.</span>
          </p>
        </div>

        <div class="col">
          <p class="para">
            <span class="para-title">Data Vault </span>
            <span class="text">is a method of storing data inside the browser that it's only accessible by the user. This is different from traditional Browser Cookie because cookies are mostly vulnerable to attack since is accessible through the network</span>
          </p>
        </div>

        <div class="col">
          <p class="para">
            <span class="para-title">Anti-Debugging </span>
            <span class="text">This is the application's first line of defense, it prevent hackers from reading the flow of the code by blocking the debugging feature of the computer browser. The debugging tool is only for computer browser, this feature is not built on a mobile browser. You can try it be pressing F12 on your keyboard. </span>
            <span class="para-title">Caution: your browser may freeze or crash.</span>
          </p>
        </div>

        <div class="col">
          <p class="para">
            <span class="para-title">Code Obfuscation. </span>
            <span class="text">Obfuscation means to make something unclear. That exactly Code Obfuscation do, it makes the code unclear so that it cannot be understood directly. By re-arranging the code and converting some value into hexadecimal. The finish product looks nothing like the original code that even the programmer no longer recognized.</span>
          </p>
        </div>

        <div class="col">
          <p class="para">
            <span class="para-title">HTTP Security Headers </span>
            <span class="text">are special instruction for the browser, it tell the browser to ignore unwanted data that does not pass a specific protocol. This prevent the database to processed altered data, if a hacker managed to alter the request data.</span>
          </p>
        </div>

        <div class="col">
          <div class="fit column wrap justify-center items-start content-center">
            <q-btn flat rounded class="extra-space doc-button" color="white" size="lg" label="Back" @click="returnHome">
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
    returnHome () {
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

  .page {
    height: 90rem;
  }

  .extra-space {
    margin-top: 0.9rem;
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

    .page {
      height: 60rem;
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

    .page {
      height: 70rem;
    }
  }
</style>
