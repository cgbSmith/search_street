<template>
  <div id="box">
    {{ res }}
    <h1></h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      res: null
    }
  },
  mounted() {
    // test().then(res => {
    //   this.res = res;
    // })
  }
}
</script>

<style scoped>
#box {
  width: 100%;
  height: 100%;
  background-color: #fff;
  background-image:url('../assets/map.jpg') ;
  background-size: 100%;
  background-position: center;
  /* background-size: cover; */
  /* position: fixed; */
}
</style>
