<template>
  <transition appear name="slide">
    <div class="user">
      <div class="header">
        <i class="icon icon-back" @click="back"></i>
        <base-switch v-model="current" :data="data"></base-switch>
      </div>
      <div class="button-wrapper">
        <base-button @click="handleClick"></base-button>
      </div>
      <div class="main" ref="main">
        <base-scroll class="favorite" :key="0" v-if="current === 0" ref="favorite" :data="favoriteList">
          <base-list :data="favoriteList" @click="selectSong"></base-list>
        </base-scroll>
        <base-scroll class="play" :key="1" v-if="current === 1" ref="play" :data="playHistory">
          <base-list :data="playHistory" @click="selectSong"></base-list>
        </base-scroll>
      </div>
    </div>
  </transition>
</template>

<script>
import BaseSwitch from '@/components/base-switch';
import BaseButton from '@/components/base-button';
import BaseScroll from '@/components/base-scroll';
import BaseList from '@/components/base-list';
import { playListMixin } from '@/common/js/mixin';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'vmUser',
  mixins: [playListMixin],
  data() {
    return {
      current: 0,
      data: ['我喜欢的', '最近播放']
    }
  },
  computed: {
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ])
  },
  methods: {
    handlePlayList(list) {
      const bottom = list?.length ? '60px' : '0px';
      this.$refs.main.style.height = `calc(100vh - 7rem - ${bottom})`;
      this.$refs.favorite?.refresh();
      this.$refs.playHistory?.refresh();
    },
    back() {
      this.$router.go(-1);
    },
    handleClick() {
      this.randomPlay(!this.current ? this.favoriteList : this.playHistory);
    },
    selectSong(item) {
      this.insertSong(item);
    },
    ...mapActions([
      'randomPlay',
      'insertSong'
    ])
  },
  components: {
    BaseSwitch,
    BaseButton,
    BaseScroll,
    BaseList
  }
}
</script>

<style lang="stylus">
  .user
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
    .header
      position: relative
      display: flex
      justify-content: center
      align-items: center
      height: 2.5rem
      .icon-back
        position: absolute
        top: 0
        left: 0
        padding: 0.625rem
        font-size: var(--font-size-large-x)
        color: var(--color-theme)
    .button-wrapper
      margin: 1.25rem 0
    .main
      height: calc(100vh - 7rem)
      overflow: hidden
      .favorite, .play
        height: 100%
</style>
