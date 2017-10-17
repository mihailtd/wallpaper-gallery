<template>
  <div id="app">
    <landing-page></landing-page>
  </div>
</template>

<script>
  import LandingPage from '@/components/LandingPage'

  export default {
    name: 'electron-vue-gallery',
    components: {
      LandingPage
    }
  }
</script>

<style>
html, body {
  padding: 0;
  margin: 0;
  background-color: #564E58;
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
