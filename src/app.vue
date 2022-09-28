<template>
  <div id="vm-music">
    <vm-header></vm-header>
    <vm-nav></vm-nav>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import VmHeader from '@/views/vm-header'
import VmNav from '@/views/vm-nav'

export default {
  name: 'app',
  components: {
    VmHeader,
    VmNav
  }
};
</script>

<style lang="stylus">
h1 {
  color: deepskyblue;
}
</style>
