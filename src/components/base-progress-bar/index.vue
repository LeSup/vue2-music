<template>
  <div class="progress-bar" @click="handleClick">
    <div class="total" ref="total">
      <div class="inner" ref="inner"></div>
      <div
        class="button"
        ref="button"
        @touchstart="handleStart"
        @touchmove="handleMove"
        @touchend="handleEnd"
      ></div>
    </div>
  </div>
</template>

<script>
const ButtonWidth = 16;

export default {
  name: 'baseProgressBar',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent(newVal) {
      if (this.touch.initiated) {
        return;
      }
      const progressLen = this._getProgressLen();
      this._offset(newVal * progressLen);
    }
  },
  created() {
    this.touch = {};
  },
  methods: {
    handleClick(e) {
      const offset = e.offsetX - ButtonWidth;
      this._offset(offset);
      this.$emit('change', e.offsetX / this.$refs.total.clientWidth);
    },
    handleStart(e) {
      this.touch = {
        initiated: true,
        startX: e.touches[0].pageX,
        left: this.$refs.inner.clientWidth
      };
    },
    handleMove(e) {
      if (this.touch.initiated) {
        const delta = e.touches[0].pageX - this.touch.startX;
        const progressLen = this._getProgressLen();
        const offset = Math.max(0, Math.min(progressLen, delta + this.touch.left));
        this._offset(offset);
      }
    },
    handleEnd() {
      if (this.touch.initiated) {
        this.touch.initiated = false;
        const progressLen = this._getProgressLen();
        const percent = this.$refs.inner.clientWidth / progressLen;
        this.$emit('change', percent);
      }
    },
    _offset(offset) {
      this.$refs.inner.style.width = offset + 'px';
      this.$refs.button.style.transform = `translateX(${offset}px)`;
    },
    _getProgressLen() {
      return this.$refs.total.clientWidth - ButtonWidth;
    }
  }
}
</script>

<style lang="stylus">
  .progress-bar
    display: flex
    align-items: center
    height: 20px
    .total
      flex: 1
      position: relative
      height: 4px
      border-radius: 2px
      background-color: var(--color-background-d)
      .inner
        height: 100%
        border-radius: 2px 0 0 2px
        background-color: var(--color-theme)
      .button
        position: absolute
        top: -6px
        left: -1px
        width: 10px
        height: 10px
        border: 3px solid var(--color-text)
        border-radius: 50%
        background-color: var(--color-theme)
</style>
