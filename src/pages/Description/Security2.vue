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
            <span class="text">is secured by L3S. Originally developed for IIPS as a password security. But by switching to web application we gonna need more than password security. Now L3S provides End-to-End Encryption, Data Lock, and Data Vault. Together with Code Obfuscation and Security Headers.</span>
          </p>
        </div>

        <div class="col">
          <p class="para">
            <span class="para-title">End-to-End Encryption. </span>
            <span class="text">This ensures that the data sent across the network is unreadable. This prevents the hacker from performing an attack called Man-in-the-Middle. But this won't stop them from altering the data, just makes it harder. This L3S feature uses its own encryption.</span>
          </p>
        </div>

        <div class="col">
          <p class="para">
            <span class="para-title">Data Lock </span>
            <span class="text">is a custom security header that serve it own purpose. It locks the data sent accros the network preventing alteration until it reach the database. </span>
          </p>
        </div>

        <div class="col">
          <p class="para">
            <span class="para-title">Data Vault </span>
            <span class="text">is a method of storing data inside the browser that it's only accessable by the user. If your thinking of Browser Cookie, then you are wrong. Cookies is not recommended because it has some vulnerability that can be access through the network.</span>
          </p>
        </div>

        <div class="col">
          <p class="para">
            <span class="para-title">Anti-Debugging </span>
            <span class="text">This is the first line of defense, it prevent hackers from reading the flow of the code by blocking the debugging feature of the computer browser. The debugging tool is only for computer browser, this feature is not built on a mobile browser. You can try it be pressing F12 on your keyboard. Warning though, your browser may freeze or crash. </span>
          </p>
        </div>

        <div class="col">
          <p class="para">
            <span class="para-title">Code Obfuscation. </span>
            <span class="text"></span>
          </p>
        </div>

        <div class="col">
          <p class="para">
            <span class="para-title">Security Headers. </span>
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

  .page {
    height: 70rem;
  }
</style>
