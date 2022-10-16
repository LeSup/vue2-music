<template>
  <div class="base-button" @click.stop="handleClick">
    <slot name="icon">
      <i class="icon icon-play"></i>
    </slot>
    <slot name="text">
      <span class="text">随机播放全部</span>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'baseButton',
  methods: {
    handleClick() {
      this.$emit('click');
    }
  }
}
</script>

<style lang="stylus">
  .base-button
    display: flex
    justify-content: center
    align-items: center
    margin: 0 auto
    width: 8.5rem
    height: 1.875rem
    color: var(--color-text-l)
    border: 0.0625rem solid
    border-radius: 1rem
    .icon
      font-size: var(--font-size-medium)
    .text
      margin-left: 0.5rem
      font-size: var(--font-size-small)
</style>
