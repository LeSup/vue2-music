<template>
  <div class="base-slide" ref="ref">
    <div class="base-slide-group" ref="slideGroup">
      <slot></slot>
    </div>
    <div class="base-slide-dots">
      <i
        class="base-slide-dot"
        :class="{active: current = index}"
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
    data: {
      type: Array,
      default() {
        return [];
      }
    },
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
    }
  },
  data() {
    return {
      current: 0,
      dots: []
    }
  },
  watch: {
    data() {
      this.$nextTick(this.refresh);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._init();
    });

    window.addEventListener('resize', this._resize);
  },
  activated() {
  },
  deactivated() {
    this.slide.disable();
    this.clearTimeout(this.timer);
  },
  destroyed() {
    this.slide.disable();
    this.clearTimeout(this.timer);
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
    _init() {
      this._initSlideWidth();
      this._initDots();
      this._initSlide();
    },
    _initSlideWidth() {
      const clientWidth = this.$refs.slide.clientWidth;
      const slideGroup = this.$refs.slideGroup;
      const children = slideGroup.children;

      let width = 0;
      for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        addClass(child, 'base-slide-item');
        child.style.width = clientWidth + 'px';

        width += clientWidth;
      }

      if (this.loop) {
        width += clientWidth * 2;
      }

      slideGroup.style.width = width + 'px';
    },
    _initDots() {
      this.dots = new Array(this.data.length);
    },
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

      this.slide.on('scrollEnd', this._scrollEnd);

      this.slide.on('beforeScrollStart', this._beforeScrollStart);
    },
    _scrollEnd() {
      this.current = this.slide.getCurrentPage().pageX;
      this._play();
    },
    _beforeScrollStart() {
      clearTimeout(this.timer);
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
</style>