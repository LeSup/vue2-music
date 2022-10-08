<template>
  <div class="vm-player" v-show="sequenceList.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="bg-wrapper">
          <img class="bg" :src="currentSong.pic" :alt="currentSong.name" />
        </div>
        <div class="header">
          <div class="back" @click="toggleFullScreen">
            <i class="icon icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subTitle">{{currentSong.singer}}</h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper">
              <div class="cd" ref="cd">
                <img class="image" :src="currentSong.pic" :alt="currentSong.name" />
              </div>
            </div>
            <p class="lyric"></p>
          </div>
          <div class="middle-r">

          </div>
        </div>
        <div class="footer">
          <div class="dots">
            <span class="dot active"></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <div class="time">00:06</div>
            <div class="progress-bar"></div>
            <div class="time">00:06</div>
          </div>
          <div class="operators">
            <div class="i-wrapper i-left">
              <i class="icon icon-sequence"></i>
            </div>
            <div class="i-wrapper i-left">
              <i class="icon icon-prev"></i>
            </div>
            <div class="i-wrapper i-center">
              <i class="icon icon-play"></i>
            </div>
            <div class="i-wrapper i-right">
              <i class="icon icon-next"></i>
            </div>
            <div class="i-wrapper i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="toggleFullScreen">
        <div class="cd-wrapper">
          <div class="cd">
            <img class="image" :src="currentSong.pic" :alt="currentSong.name" />
          </div>
        </div>
        <div class="text">
          <h2 class="name">{{ currentSong.name }}</h2>
          <p class="desc">{{ currentSong.singer }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import animations from 'create-keyframe-animation';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'vmPlayer',
  computed: {
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'fullScreen'
    ])
  },
  methods: {
    toggleFullScreen() {
      this.setFullScreen(!this.fullScreen);
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      console.log( x, y, scale)
      animations.registerAnimation({
        name: 'move',
        animation: {
          0: {
            transform: `translate(${x}px, ${y}px) scale(${scale})`
          },
          60: {
            transform: 'translate(0, 0) scale(1.1)'
          },
          100: {
            transform: 'translate(0, 0) scale(1)'
          }
        },
        presets: {
          duration: 400,
          easing: 'linear'
        }
      });

      animations.runAnimation(this.$refs.cd, 'move', done);
    },
    afterEnter() {
      animations.unregisterAnimation('move');
      this.$refs.cd.style.animation = '';
    },
    leave(el ,done) {
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cd.style.transition = 'transform 0.4s';
      this.$refs.cd.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      this.$refs.cd.addEventListener('transitionend', done);
    },
    afterLeave() {
      this.$refs.cd.style.transition = '';
      this.$refs.cd.style.transform = '';
    },
    _getPosAndScale() {
      const width = window.innerWidth * 0.8;
      const x = 20 + 20 - (window.innerWidth / 2);
      const y = (window.innerHeight - 30) - (width / 2 + 80);
      const scale = 40 / width;
      return {
        x,
        y,
        scale
      };
    },
    ...mapMutations([
      'setFullScreen'
    ])
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/mixin'

  .normal-player
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    background-color: var(--color-background)
    overflow: hidden
    &.normal-enter-active, &.normal-leave-active
      transition: opacity 0.4s
      .header, .footer
        transition: transform 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .header
        transform: translateY(-100%)
      .footer
        transform: translateY(100%)
    .bg-wrapper
      position: absolute
      top: 0
      right: 0
      bottom: 0
      left: 0
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
      .bg
        width: 100%
        height: 100%
    .header
      position: relative
      padding: 0 2.5rem
      text-align: center
      color: var(--color-text)
      .back
        position: absolute
        top: 0
        left: 0
        .icon-back
          display: block
          padding: 0.625rem
          font-size: var(--font-size-large-x)
          color: var(--color-theme)
          transform: rotate(-90deg)
      .title
        font-size: var(--font-size-large)
        line-height: 2.5rem
        ellipsis()
      .subTitle
        font-size: var(--font-size-medium)
        line-height: 1
        ellipsis()
    .middle
      position: absolute
      top: 80px
      bottom: 170px
      width: 100%
      font-size: 0
      .middle-l, .middle-r
        display: inline-block
        width: 100%
        height: 100%
      .cd-wrapper
        position: relative
        margin: 0 auto
        width: 80%
        padding-bottom: 80%
        .cd
          position: absolute
          top: 0
          right: 0
          bottom: 0
          left: 0
          .image
            width: 100%
            height: 100%
            border-radius: 50%
            border: 10px solid rgba(255, 255, 255, 0.1)
            box-sizing: border-box
    .footer
      position: absolute
      right: 0
      bottom: 0
      left: 0
      padding-bottom: 20px
      .dots
        margin: 20px 0
        text-align: center
        font-size: 0
        .dot
          display: inline-block
          width: 8px
          height: 8px
          border-radius: 4px
          background-color: var(--color-text-l)
          &:not(:last-child)
            margin-right: 4px
          &.active
            width: 20px
            background-color: var(--color-text-ll)
      .progress-wrapper
        display: flex
        justify-content: center
        align-items: center
        margin: 20px 0
        font-size: var(--font-size-small)
        .time
          &:not(:last-child)
            margin-right: 6px
      .operators
        display: flex
        justify-content: space-evenly
        align-items: center
        margin: 20px 0
        .i-wrapper
          flex: 1
          color: var(--color-theme)
          &.disable
            color: var(--color-theme-d)
          .icon
            font-size: 30px
        .i-left
          text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          .icon
            font-size: 40px
        .i-right
          text-align: left
        .icon-favorite
          color: var(--color-sub-theme)
  .mini-player
    position: fixed
    right: 0
    bottom: 0
    left: 0
    display: flex
    align-items: center
    height: 60px
    background-color: var(--color-highlight-background)
    overflow: hidden
    &.mini-enter-active, &.mini-leave-active
        transition: opacity 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
    .cd-wrapper
      flex: 0 0 40px
      margin-left: 20px
      height: 40px
      .cd
        height: 100%
        .image
          width: 100%
          height: 100%
          border-radius: 50%
    .text
      flex: 1
      margin-left: 10px
      line-height: 1.25rem
      min-height: 0
      .name
        margin-bottom: 0.125rem
        font-size: var(--font-size-medium)
        color: var(--color-text)
        ellipsis()
      .desc
        font-size: var(--font-size-small)
        color: var(--color-text-d)
        ellipsis()
</style>
