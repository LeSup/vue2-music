<template>
  <transition appear name="slide">
    <base-music
      class="vm-detail"
      :title="album.title"
      :pic="album.pic"
      :data="albums"
    >
    </base-music>
  </transition>
</template>

<script>
import BaseMusic from '@/components/base-music';
import { getAlbum } from '@/services/recommend';
import { mapGetters } from 'vuex';

export default {
  name: 'vmDetail',
  data() {
    return {
      albums: []
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
      const { songs } = await getAlbum(params);
      this.albums = songs;
    }
  },
  components: {
    BaseMusic
  }
}
</script>

<style lang="stylus">
  .vm-detail
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    background-color: var(--color-background)
    &.slide-enter-active, &.slide-leave-active
      transition: transform 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translateX(100%)
</style>
