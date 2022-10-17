<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll';

const DIR_H = 'horizontal';
const DIR_V = 'vertical';

export default {
  name: 'baseScroll',
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    probeType: {
      type: Number,
      default: 1
    },
    direction: {
      type: String,
      default: DIR_V
    }
  },
  watch: {
    data() {
      // 因为要拿到计算后的高度，所以在下次选然后执行
      this.$nextTick(this.refresh);
    }
  },
  mounted() {
    setTimeout(this._initScroll, 20);
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        pullUpLoad: true,
        probeType: this.probeType,
        eventPassthrough: this.direction === DIR_V ? DIR_H : DIR_V
      });

      if (this.$listeners.scroll) {
        this.scroll.on('scroll', pos => {
          this.$emit('scroll', pos);
        });
      }

      if (this.$listeners.scrollEnd) {
        this.scroll.on('scrollEnd', (pos) => {
          // 距离底部50px时触发
          if (this.scroll.y < this.scroll.maxScrollY + 50) {
            this.$emit('scrollEnd', pos);
          }
        });
      }
    },
    refresh() {
      this.scroll?.refresh();
    },
    scrollToElement(el, time) {
      this.scroll?.scrollToElement(el, time);
    },
    // 滚动到指定的位置
    scrollTo(x, y, time) {
      this.scroll.scrollTo(x, y, time);
    }
  }
}
</script>

<style>
</style>
