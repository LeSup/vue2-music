<template>
  <ul class="base-list">
    <li class="base-list-item" @click="handleClick(item, index)" v-for="item in data" :key="item.id">
      <h2 class="title">{{item.name}}</h2>
      <p class="desc">{{item.singer}}-{{item.album}}</p>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'baseList',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    handleClick(item, index) {
      this.$emit('click', item, index);
    }
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/mixin'

  .base-list
    padding: 1.25rem
    font-size: var(--font-size-medium)
    line-height: 1.5rem
    background-color: var(--color-background)
  .base-list-item
    &:not(:first-child)
      margin-top: 1.25rem
    .title
      ellipsis()
      color: var(--color-text)
    .desc
      margin-top: 0.25rem
      ellipsis()
      color: var(--color-text-d)
</style>
