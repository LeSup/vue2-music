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
      this.refresh();
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
        probeType: this.probeType,
        eventPassthrough: this.direction === DIR_V ? DIR_H : DIR_V
      });

      if (this.$listeners.scroll) {
        this.scroll.on('scroll', pos => {
          this.$emit('scroll', pos);
        });
      }
    },
    refresh() {
      // 因为要拿到计算后的高度，所以在下次选然后执行
      this.$nextTick(() => {
        this.scroll?.refresh();
      });
    },
    scrollToElement(el, time) {
      this.scroll.scrollToElement(el, time);
    }
  }
}
</script>

<style>

</style>
