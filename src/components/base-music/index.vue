<template>
  <div class="base-music">
    <div class="header" ref="header">
      <div class="back" @click="goBack">
        <i class="icon icon-back"></i>
      </div>
      <h1 class="title">{{title}}</h1>
    </div>
    <div class="bg-wall" :class="{active: fixed}" :style="bgStyle" ref="wall">
      <div class="button-wrapper" v-show="!fixed">
        <base-button class="music-button" @click="handleClick"></base-button>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <base-scroll
      class="list-wrapper"
      ref="scroll"
      @scroll="handleScroll"
      :data="data"
      :probeType="3"
    >
      <base-list :data="data" :rank="rank" @click="handleClickItem"></base-list>
      <template v-if="!data.length">
        <base-loading></base-loading>
      </template>
    </base-scroll>
  </div>
</template>

<script>
import BaseButton from '@/components/base-button';
import BaseList from '@/components/base-list';
import BaseLoading from '@/components/base-loading';
import BaseScroll from '@/components/base-scroll';
import { playListMixin } from '@/common/js/mixin';
import { mapActions } from 'vuex';

const MAX_BLUR = 10;

export default {
  name: 'baseMusic',
  mixins: [playListMixin],
  props: {
    title: {
      type: String,
      default: ''
    },
    pic: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
  },
  data() {
    return {
      fixed: false
    };
  },
  computed: {
    bgStyle() {
      return {
        'background-image': `url(${this.pic})`,
      };
    },
  },
  created() {
    this.wallHeight = 0;
    this.maxScrollHeight = 0;
  },
  mounted() {
    const headerRect = this.$refs.header.getBoundingClientRect();
    this.wallHeight = window.innerWidth * 0.7;
    this.maxScrollHeight = this.wallHeight - headerRect.height;
  },
  methods: {
    handlePlayList(list) {
      const height = list?.length > 0 ? '60px' : '0px';
      this.$refs.scroll.$el.style.bottom = height;
      this.$refs.scroll.refresh();
    },
    goBack() {
      this.$router.go(-1);
    },
    handleScroll(pos) {
      const scrollY = pos.y;

      this._scrollUp(scrollY);
      this._scrollDown(scrollY);
    },
    handleClick() {
      this.randomPlay({ list: this.data });
    },
    handleClickItem(item, index) {
      this.selectPlay({
        list: this.data,
        index
      });
    },
    _scrollUp(scrollY) {
      let blur = 0;
      let fixed = false;

      if (scrollY < 0) {
        blur = Math.min(MAX_BLUR, -(MAX_BLUR / this.maxScrollHeight * scrollY));
        if (-scrollY >= this.maxScrollHeight) {
          fixed = true;
        }
      }

      this.fixed = fixed;
      this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`;
    },
    _scrollDown(scrollY) {
      let scale = 1;

      if (scrollY > 0) {
        scale = 1 + Math.min(1, scrollY / this.wallHeight);
      }

      this.$refs.wall.style.transform = `scale(${scale})`;
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  components: {
    BaseButton,
    BaseList,
    BaseLoading,
    BaseScroll
  }
}
</script>

<style lang="stylus">
  .base-music
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    background-color: var(--color-background)
    overflow hidden
    .header
      position: absolute
      right: 0
      left: 0
      z-index: 3
      height: 2.5rem
      .back
        position: absolute
        top: 0
        left: 0
        .icon-back
          display: block
          padding: 0.625rem
          font-size: var(--font-size-large-x)
          color: var(--color-theme)
      .title
        font-size: var(--font-size-large)
        line-height: 2.5rem
        text-align: center
        color: var(--color-text)
    .bg-wall
      position: relative
      padding-bottom: 70%
      background-size: cover
      transform-origin: top center
      &.active
        height: 2.5rem
        padding-bottom: 0
        z-index: 2
      .button-wrapper
        position: absolute
        right: 0
        bottom: 1.25rem
        left: 0
        z-index: 1
        .music-button
          color: var(--color-theme)
      .filter
        position: absolute
        top: 0
        right: 0
        bottom: 0
        left: 0
        background-color: rgba(7, 17, 27, 0.4)
    .list-wrapper
      position: absolute
      top: 70vw
      right: 0
      bottom: 0
      left: 0
      .base-list
        position: relative
        z-index: 1
</style>
