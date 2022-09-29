<template>
  <div class="base-music">
    <div class="header">
      <div class="back" @click="goBack">
        <i class="icon icon-back"></i>
      </div>
      <h1 class="title">{{title}}</h1>
    </div>
    <div class="bg-container" :style="bgStyle">
      <div class="button-wrapper">
        <base-button class="music-button"></base-button>
      </div>
      <div class="filter"></div>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/base-button';

export default {
  name: 'baseMusic',
  props: {
    title: {
      type: String,
      default: ''
    },
    pic: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
  },
  computed: {
    bgStyle() {
      return {
        'background-image': `url(${this.pic})`
      };
    }
  },
  mounted() {
    console.log(this.title);
    console.log(this.pic);
    console.log(this.data);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  },
  components: {
    BaseButton
  }
}
</script>

<style lang="stylus">
  .base-music
    position: relative
    .header
      position: absolute
      right: 0
      left: 0
      z-index: 1
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
    .bg-container
      position: relative
      padding-bottom: 70%
      background-size: cover
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
</style>
