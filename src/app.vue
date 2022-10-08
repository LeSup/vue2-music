<template>
  <div id="vm-music">
    <vm-header></vm-header>
    <vm-nav></vm-nav>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <vm-player></vm-player>
  </div>
</template>

<script>
import VmHeader from '@/views/vm-header';
import VmNav from '@/views/vm-nav';
import VmPlayer from '@/views/vm-player';

export default {
  name: 'app',
  components: {
    VmHeader,
    VmNav,
    VmPlayer
  }
};
</script>

<style>
</style>
