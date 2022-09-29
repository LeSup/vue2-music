<template>
  <div class="base-slide" ref="slide">
    <div class="base-slide-group" ref="slideGroup">
      <slot></slot>
    </div>
    <div class="base-slide-dots">
      <i
        class="base-slide-dot"
        :class="{active: current === index}"
        v-for="(item, index) in dots"
        :key="index"
      ></i>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import { addClass } from '@/common/js/dom';

export default {
  name: 'baseSlide',
  props: {
    loop: {
      type: Boolean,
      default: false
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    threshold: {
      type: Number,
      default: 0.3
    },
    speed: {
      type: Number,
      default: 400
    },
    interval: {
      type: Number,
      default: 3000
    },
    showDots: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      current: 0,
      dots: []
    }
  },
  mounted() {
    this.$nextTick(this.init);

    window.addEventListener('resize', this._resize);
  },
  // 被 keep-alive 缓存的组件激活时调用
  activated() {
    if (!this.slide) {
      return;
    }
    this.slide.enable();
    this._play();
  },
  // 被 keep-alive 缓存的组件失活时调用
  deactivated() {
    this.slide.disable();
    clearTimeout(this.timer);
  },
  destroyed() {
    this.slide.disable();
    clearTimeout(this.timer);
    window.removeEventListener('resize', this._resize);
  },
  methods: {
    refresh() {
      if (!this.slide) {
        return;
      }
      this._initSlideWidth();
      this._initDots();
      this.slide.refresh();
    },
    init() {
      this._initSlideWidth();
      this._initDots();
      this._initSlide();
    },
    // 初始子项的宽度，以及容器的宽度，需子节点渲染后调用
    _initSlideWidth() {
      const clientWidth = this.$refs.slide.clientWidth;
      const slideGroup = this.$refs.slideGroup;
      this.children = slideGroup.children;

      let width = 0;
      for (let i = 0, len = this.children.length; i < len; i++) {
        const child = this.children[i];
        addClass(child, 'base-slide-item');
        child.style.width = clientWidth + 'px';

        width += clientWidth;
      }

      // 初始时，
      if (this.loop && !this.isResize) {
        this.isResize = true;
        width += clientWidth * 2;
      }

      slideGroup.style.width = width + 'px';
    },
    _initDots() {
      if (!this.showDots) {
        return;
      }
      this.dots = new Array(this.children.length);
    },
    // 初始化BScroll，以及监听相应的事件
    _initSlide() {
      this.slide = new BScroll(this.$refs.slide, {
        scrollX: true,
        scrollY: false,
        // 根据滑动的距离和时间计算出动量，并生成滚动动画
        momentum: false,
        bounce: false,
        stopPropagation: true,
        snap: {
          loop: this.loop,
          threshold: this.threshold,
          speed: this.speed
        }
      });

      // 滚动结束后，设置页码，以及重新播放
      this.slide.on('scrollEnd', this._scrollEnd);

      // 触摸后重新播放
      this.slide.on('touchEnd', this._play);

      // 滚动前（自动、手动），清除定时
      this.slide.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer);
        }
      });

      this._play();
    },
    _scrollEnd() {
      this.current = this.slide.getCurrentPage().pageX;
      this._play();
    },
    _play() {
      if (!this.autoPlay) {
        return;
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.slide.next();
      }, this.interval);
    },
    _resize() {
      if (!this.slide?.enable) {
        return;
      }

      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        if (this.slide.isInTransition) {
          this._scrollEnd();
        } else {
          this._play();
        }
        this.refresh();
      }, 60);
    }
  }
}
</script>

<style lang="stylus">
  .base-slide
    position: relative
  .base-slide-group
    overflow: hidden
  .base-slide-item
    float: left
    overflow: hidden
  .base-slide-dots
    position: absolute
    display: flex
    justify-content: center
    bottom: 12px
    left: 50%
    transform: translateX(-50%)
  .base-slide-dot
    width: 8px
    height: 8px
    border-radius: 4px
    background-color: var(--color-text-l)
    &:not(:last-child)
      margin-right: 8px
    &.active
      width: 20px
      background-color: var(--color-text-ll)
</style>
