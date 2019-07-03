<template>
  <div id="app">
    <nuxt-link to="/" class="to-home">
      <i class="icon icon-home"></i>
    </nuxt-link>
    <nuxt/>
  </div>
</template>
<script>
export default {
  async beforeCreate() {
    await this.$store.dispatch('clientInit');
  },
  async mounted() {
    await this.$store.dispatch('valid');
  }
}
</script>


<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "~static/styles/base/variable";
html,
body {
  background-color: $body-bg;
}
</style>

