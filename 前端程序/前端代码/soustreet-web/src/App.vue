<template>
  <div id="app" class="background">
    <navibar></navibar>
    <router-view ></router-view>
  </div>
</template>

<script>
import navibar from './components/navibar'

export default {
  name: 'App',
  components: {
    navibar,
  },
}
</script>

<style scoped>
.background {
  /* background: url('./assets/map.jpg'); */
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
  opacity: 0.8;
}
</style>
