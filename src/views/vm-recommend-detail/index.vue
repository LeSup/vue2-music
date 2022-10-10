<template>
  <transition appear name="slide">
    <base-music
      :title="album.title"
      :pic="album.pic"
      :data="songs"
    >
    </base-music>
  </transition>
</template>

<script>
import BaseMusic from '@/components/base-music';
import { getAlbum } from '@/services/recommend';
import { processSongs } from '@/services/song';
import { mapGetters } from 'vuex';

export default {
  name: 'vmRecommendDetail',
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'album'
    ])
  },
  mounted() {
    if (!this.album.id) {
      this.$router.replace({
        path: '/recommend'
      });
    }
    this.getAlbum(this.album);
  },
  methods: {
    async getAlbum(params) {
      const result = await getAlbum(params);
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
