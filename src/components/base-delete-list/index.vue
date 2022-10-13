<template>
  <ul class="delete-list">
    <li class="delete-item" @click="handleClick(item, index)" v-for="(item, index) in data" :key="index">
      <p class="text">{{item}}</p>
      <span class="icon-wrapper" @click.stop="handleDelete(index)">
        <i class="icon icon-delete"></i>
      </span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'baseDeleteList',
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
    },
    handleDelete(index) {
      this.$emit('delete', index);
    }
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/mixin'

  .delete-list
    .delete-item
      display: flex
      align-items: center
      font-size: var(--font-size-medium)
      height: 1.5rem
      color: var(--color-text-l)
      &:not(:first-child)
        margin-top: 0.75rem
      .text
        flex: 1
        min-width: 0
        ellipsis()
      .icon-wrapper
        margin-left: 1rem
        spread-area()
        .icon
          font-size: var(--font-size-small)
</style>
