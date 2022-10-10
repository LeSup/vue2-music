<template>
  <div class="progress-circle">
    <svg :width="diameter" :height="diameter" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset" />
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'baseProgressCircle',
  props: {
    diameter: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dashArray: Math.PI * 100
    }
  },
  computed: {
    dashOffset() {
      return (1 - this.percent) * this.dashArray
    }
  }
}
</script>

<style lang="stylus">
  .progress-circle
    position: relative
    .progress-background
      stroke-width: 8px
      transform-origin: center
      transform: scale(0.9)
      stroke: var(--color-theme-d)
    .progress-bar
      stroke-width: 8px
      transform-origin: center
      transform: scale(0.9) rotate(-90deg)
      stroke: var(--color-theme)
</style>
