<template>
  <div>
    <h1>hello world!</h1>
    <ul>
      <router-link to="/home" tag="li">
        <span>to home</span>
      </router-link>
      <router-link to="/detail/123" tag="li">
        <span>to detail</span>
      </router-link>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus">
  h1 {
    color: deepskyblue
  }
</style>