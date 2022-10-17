<template>
  <div class="vm-header">
    <span class="vm-header-img"></span>
    <h1 class="vm-header-text">Vue Music</h1>
    <i class="vm-header-icon icon-mine" @click="handleClick"></i>
  </div>
</template>

<script>
export default {
  name: 'vmHeader',
  methods: {
    handleClick() {
      this.$router.push({
        path: '/user'
      });
    }
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/mixin'

  .vm-header
    position: relative
    display: flex
    justify-content: center
    align-items: center
    height: 2.5rem
  .vm-header-img
    width: 1.875rem
    height: 2rem
    background-size: 1.875rem 2rem
    bg-img('logo')
  .vm-header-text
    margin-left: 0.5rem
    font-size: var(--font-size-large)
    color: var(--color-theme)
  .vm-header-icon
    position: absolute
    top: 0
    right: 0
    padding: 0.625rem
    font-size: var(--font-size-large-x)
    color: var(--color-theme)
</style>
