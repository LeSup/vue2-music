<template>
  <transition name="slide">
    <div class="add-song" v-show="visible" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <i class="icon icon-close" @click="hide"></i>
      </div>
      <div class="search-box-wrapper">
        <base-search-box v-model="search"></base-search-box>
      </div>
      <div class="main">
        <div class="no-search" v-if="!search">
          <div class="switch-wrapper">
            <base-switch :value="current" :data="data" @change="toggleCurrent"></base-switch>
          </div>
          <div class="content">
            <base-scroll :key="0" class="play-history" ref="playHistory" v-if="current === 0" :data="playHistory">
              <base-list :data="playHistory" @click="clickPlay"></base-list>
            </base-scroll>
            <base-scroll :key="1" class="search-history" ref="searchHistory" v-if="current === 1" :data="searchHistory">
              <base-delete-list :data="searchHistory" @click="clickSearch" @delete="deleteSearch"></base-delete-list>
            </base-scroll>
          </div>
        </div>
        <base-search-result v-if="search" :value="search" @click="selectSearch"></base-search-result>
      </div>
      <base-top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </base-top-tip>
    </div>
  </transition>
</template>

<script>
import BaseSearchBox from '@/components/base-search-box';
import BaseSwitch from '@/components/base-switch';
import BaseScroll from '@/components/base-scroll';
import BaseList from '@/components/base-list';
import BaseDeleteList from '@/components/base-delete-list';
import BaseSearchResult from '@/components/base-search-result';
import BaseTopTip from '@/components/base-top-tip';
import { mapActions, mapGetters } from 'vuex';
import { searchMixin } from '@/common/js/mixin';

export default {
  name: 'baseAddSong',
  mixins: [searchMixin],
  data() {
    return {
      visible: false,
      current: 0,
      data: ['最近播放', '搜索历史']
    }
  },
  computed: {
    ...mapGetters([
      'playHistory',
    ])
  },
  methods: {
    show() {
      this.visible = true;
      this.refresh();
    },
    hide() {
      this.visible = false;
    },
    toggleCurrent(value) {
      this.current = value;
    },
    clickPlay(song) {
      this.insertSong(song);
      this.$refs.topTip.show();
    },
    refresh() {
      this.$nextTick(() => {
        this.$refs.playHistory?.refresh();
        this.$refs.searchHistory?.refresh();
      });
    },
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    BaseSearchBox,
    BaseSwitch,
    BaseScroll,
    BaseList,
    BaseDeleteList,
    BaseSearchResult,
    BaseTopTip
  }
}
</script>

<style lang="stylus">
  .add-song
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
      height: 2.5rem
      .title
        font-size: var(--font-size-large)
        line-height: 2.5rem
        text-align: center
        color: var(--color-text)
      .icon
        position: absolute
        top: 0
        right: 0
        padding: 0.6875rem 1.25rem
        font-size: var(--font-size-large)
        color: var(--color-theme)
    .search-box-wrapper
      margin: 1.25rem 0
      padding: 0 1.25rem
    .main
      height: calc(100vh - 7rem)
      .no-search
        height: 100%
      .content
        height: calc(100vh - 9.125rem)
        .play-history, .search-history
          height: 100%
          overflow: hidden
  .tip-title
    height: 2.5rem
    line-height: 2.5rem
    text-align: center
    .icon-ok
      font-size: var(--font-size-medium)
      color: var(--color-theme)
    .text
      margin-left: 4px
      font-size: var(--font-size-medium)
      color: var(--color-text-ll)
</style>
