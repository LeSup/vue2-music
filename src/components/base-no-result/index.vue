<template>
  <div class="no-result">
    <div class="image"></div>
    <p class="text">{{text}}</p>
  </div>
</template>

<script>
export default {
  name: 'baseNoResult',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/mixin'

  .no-result
    position: absolute
    top: 40%
    left: 50%
    transform: translate(-50%, -50%)
    .image
      width: 5.375rem
      height: 5.625rem
      margin: 0 auto
      background-size: 5.375rem 5.625rem
      bg-img('no-result')
    .text
      margin-top: 1.875rem
      font-size: var(--font-size-medium)
      text-align: center
      color: var(--color-text-d)
</style>
