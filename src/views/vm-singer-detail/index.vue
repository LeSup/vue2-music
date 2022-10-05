<template>
  <transition name="slide">
    <base-music :title="singer.name" :pic="singer.pic" :data="songs"></base-music>
  </transition>
</template>

<script>
import BaseMusic from '@/components/base-music';
import { getSingerDetail } from '@/services/singer';
import { mapGetters } from 'vuex';

export default {
  name: 'vmSingerDetail',
  data() {
    return {
      songs: []
    };
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  mounted() {
    if (!this.singer?.mid) {
      this.$router.replace('/singer');
      return;
    }
    this.getSingerDetail();
  },
  methods: {
    async getSingerDetail() {
      const { songs } = await getSingerDetail(this.singer);
      this.songs = songs;
    }
  },
  components: {
    BaseMusic
  }
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: transform 0.3s
  .slide-enter, .slide-leave-to
    transform: translateX(100%)
</style>
