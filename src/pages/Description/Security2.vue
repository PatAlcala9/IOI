<template>
  <q-page padding class="page">
    <div class="q-pa-md">
      <div class="column">
        <div class="col">
          <div class="pageTitle">
            <span class="text title">Insert Logo Here</span>
          </div>
        </div>

        <div class="col">
          <p class="para">
            <span class="para-title">IIPS Online Inspection </span>
            <span class="text">is secured by L3S. Originally developed for IIPS as a password security. But by switching to web application we gonna need more than password security. Now L3S provides End-to-End Encryption, Data Lock, Security Headers, Data Vault, and Code Obfuscation</span>
          </p>
        </div>

        <div class="col">
          <p class="para">
            <span class="para-title">End-to-End Encryption </span>
            <span class="text">is a security features that ensures every data send to the network is encrypted. No Data is leaked accros the network.</span>
          </p>
        </div>

        <div class="col">
          <p class="para">
            <span class="para-title">Data Lock </span>
            <span class="text">is a security features that ensures the data sent to the network is unchangeable. </span>
          </p>
        </div>

        <div class="col">
          <p class="para">
            <span class="para-title">Security Headers </span>
            <span class="text"></span>
          </p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
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
</style>
