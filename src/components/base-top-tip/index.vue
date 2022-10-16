<template>
  <transition name="slide-down">
    <div class="top-tip" @click.stop="close" v-show="visible">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'baseTopTip',
  data() {
    return {
      visible: false
    };
  },
  methods: {
    show() {
      this.visible = true;
      this.clear(2000);
    },
    close() {
      this.clear(0);
    },
    hide() {
      this.visible = false;
    },
    clear(interval) {
      clearTimeout(this.timer);
      this.timer = setTimeout(this.hide, interval);
    }
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/mixin'

  .top-tip
    position: fixed
    top: 0
    right: 0
    left: 0
    background-color: var(--color-background-d)
    backdrop-filter-blur(5px)
    &.slide-down-enter-active, &.slide-down-leave-active
      transition: transform 0.3s
    &.slide-down-enter, &.slide-down-leave-to
      transform: translateY(-100%)
</style>
