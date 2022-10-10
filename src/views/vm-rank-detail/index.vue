<template>
  <transition name="slide">
    <base-music :title="rank.name" :pic="rank.pic" :rank="true" :data="songs"></base-music>
  </transition>
</template>

<script>
import BaseMusic from '@/components/base-music';
import { getTopDetail } from '@/services/top-list';
import { processSongs } from '@/services/song';
import { mapGetters } from 'vuex';

export default {
  name: 'vmRankDetail',
  data() {
    return {
      songs: []
    };
  },
  computed: {
    ...mapGetters([
      'rank'
    ])
  },
  mounted() {
    if (!this.rank?.id) {
      this.$router.replace('/rank');
      return;
    }
    this.getTopDetail();
  },
  methods: {
    async getTopDetail() {
      const result = await getTopDetail(this.rank);
      const songs = await processSongs(result.songs);
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
