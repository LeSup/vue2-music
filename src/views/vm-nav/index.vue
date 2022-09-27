<template>
  <ul class="vm-nav">
    <router-link to="/recommend" tag="li" class="vm-nav-item">
      <span class="text">
        推荐
        <i class="text-i"></i>
      </span>
    </router-link>
    <router-link to="/singer" tag="li" class="vm-nav-item">
      <span class="text">
        歌手
        <i class="text-i"></i>
      </span>
    </router-link>
    <router-link to="/rank" tag="li" class="vm-nav-item">
      <span class="text">
        排行
        <i class="text-i"></i>
      </span>
    </router-link>
    <router-link to="/search" tag="li" class="vm-nav-item">
      <span class="text">
        搜索
        <i class="text-i"></i>
      </span>
    </router-link>
  </ul>
</template>

<script>
export default {
  name: 'vmNav'
}
</script>

<style lang="stylus">
  .vm-nav
    display: flex
  .vm-nav-item
    flex: 1
    height: 2.5rem
    font-size: var(--font-size-medium)
    line-height: 2.5rem
    text-align: center
    color: var(--color-text-l)
    .text
      position: relative
      .text-i
        position: absolute
        bottom: -4px
        left: 0
        width: 100%
        height: 2px
        background-color: var(--color-theme)
        transition: transform 0.3s
        transform: scale(0)
    &.router-link-active
      color: var(--color-theme)
      .text-i
        transform: scale(1.2)
</style>
