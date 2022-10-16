<template>
  <ul class="switch">
    <li
      class="btn"
      :class="{active: value === index}"
      @click="handleClick(index)"
      v-for="(item, index) in data"
      :key="index"
    >
      {{item}}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'baseSwitch',
  props: {
    value: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    handleClick(index) {
      this.$emit('change', index);
    }
  }
}
</script>

<style lang="stylus">
  .switch
    display: flex
    width: 15rem
    margin: 0 auto
    border-radius: 5px
    border: 1px solid var(--color-highlight-background)
    .btn
      flex: 1
      font-size: var(--font-size-medium)
      line-height: 2rem
      text-align: center
      color: var(--color-text-l)
      &.active
        color: var(--color-text)
        background-color: var(--color-highlight-background)
        border-radius: 5px
</style>
