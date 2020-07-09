<template>
  <q-page class="workArea">
      <img class="logo"  src="../assets/ocbologo.svg" alt="OCBO Logo"/>
    <br/>
    <h2 class="page-title h2-light">404 || Page Error</h2>

    <img class="logo2" src="../assets/davaologo_glow.png" alt="Davao Logo"/>
    <br/>
    <q-btn unelevated style="width:200px; height:50px;" color="primary" label="Return" @click="backPage" />
  </q-page>
</template>

<script>
export default {
  name: 'Error404',
  data () {
    return {}
  },
  methods: {
    backPage () {
      this.$router.push('/', () => {})
    }
  }
}
</script>

<style scoped>
.page-title {
  margin-top: -21px;
  font-weight: bold;
}

.logo {
  margin-top: 5px;
  width: 250px;
  height: 250px;
}

.logo2 {
  margin-top: -55px;
  width: 200px;
  /* height: 200px; */
}

.form-light {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;

  -webkit-border-radius: 18px;
  -moz-border-radius: 18px;
  border-radius: 18px;
  /* border: 5px solid #001628; */
  /* border: 5px solid #4A8EFE; */
  /* border: 5px solid #031a23; */
  width: 500px;
  height: 300px;
  margin: 30px;
  /* background: linear-gradient(180deg,#39485a,#293441 30%,#192129 51%,#192330); */
  /* background: linear-gradient(180deg,#FDFDFE,#BBD4FE 30%,#87B4FE 51%,#4A8EFE); */
  background: #ffffff;
  /* box-shadow: 2px 2px 50px #031a23; */
}

.form-dark {
  background: #000000;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  -webkit-border-radius: 18px;
  -moz-border-radius: 18px;
  border-radius: 18px;
  width: 500px;
  height: 300px;
  margin: 30px;
}

.form-title {
  -webkit-border-radius: 40px;
  -moz-border-radius: 40px;
  align-items: center;
  align-content: center;
  background-color: #031a23;
  border-radius: 40px;
  color: #FDFDFE;
  display: inline;
  justify-content: center;
  margin: -20px 0 0 0;
  padding: 10px 20px 10px 20px;
  text-align: center;
  display: none;
  /* color: #f5d67b;
  background-color: #192129; */
  /* width: 20%;
  height: 30px; */
  /* margin-top: -15px; */
}

 .textbox {
    width: 90%;
    /* color: #3f51b5; */
  }

  .qButton {
    margin-top: 3em;
    /* width: 150px;
    height: 50px; */
     width: 180px;
    height: 40px;
  }

  .br {
    height: 40px;
  }

  .workArea {
    align-items: center;
    align-content: center;
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
  }

  .workArea::before {
    background-image: url("../assets/bg.svg");
    background-color: lightslategray;
    background-blend-mode: multiply;
    background-size: cover;
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    opacity: 0.9;
    /* opacity: 0.8; */
  }

  .h1-light {
    color: #FFFFFF;
    font-weight: bold;
    margin-bottom: -30px;
    text-transform: uppercase;
    text-emphasis: auto;
  }

  .h1-dark {
    color: #000000;
    font-weight: bold;
    margin-bottom: -30px;
    text-transform: uppercase;
    text-emphasis: auto;
  }

  .h2-light {
    color: #ffbe00;
    text-transform: uppercase;
  }

  .h2-dark {
    color: black;
    text-transform: uppercase;
    /* text-shadow: 2px 2px 5px #FFF; */
  }

  footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    /* background-color: red; */
    color: white;
    -moz-text-stroke: 0.5px red;
    -webkit-text-stroke: 0.5px red;
    text-align: center;
  }

  @media screen and (max-width: 430px) {
    .form-light {
      width: 300px;
    }

    .form-dark {
      width: 300px;
    }

    .workArea {
      background-size: 200% 100%;
    }

    .logo {
      width: 195px;
      height: 195px;
    }

    .logo2 {
      width: 150px;
      height: 150px;
    }

    .page-title {
      display: none;
    }
  }

  /* @media (min-width: 1025px) and (max-width: 1280px) {
    .form {
      width: 300px;
    }

    .workArea {
      background-size: 200% 100%;
    }

    .logo {
      width: 190px;
      height: 190px;
    }

    .page-title {
      display: none;
    }
  } */
</style>
