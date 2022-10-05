<template>
  <ul class="base-list">
    <li
      class="base-list-item"
      @click="handleClick(item, index)"
      v-for="(item, index) in data"
      :key="item.id"
    >
      <div class="serial-number" v-if="rank">
        <span class="inner" :class="getImgCls(index)">{{index + 1}}</span>
      </div>
      <div class="content">
        <h2 class="title">{{item.name}}</h2>
        <p class="desc">{{item.singer}}-{{item.album}}</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'baseList',
  props: {
    rank: {
      type: Boolean,
      default: false
    },
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
    getImgCls(index) {
      return index < 3 ? `image-${index + 1}` : '';
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
    display: flex
    align-items: center
    &:not(:first-child)
      margin-top: 1.25rem
    .serial-number
      flex: 0 0 1.625rem
      margin-right: 1.25rem
      height: 1.625rem
      font-size: var(--font-size-medium-x)
      line-height: 1.625rem
      text-align: center
      color: var(--color-theme)
      .inner
        display: inline-block
        width: 100%
        height: 100%
      [class*='image-']
        background-size: 1.625rem 1.625rem
        text-indent: -3.25rem
        overflow: hidden
      .image-1
        bg-img('first')
      .image-2
        bg-img('second')
      .image-3
        bg-img('third')
    .content
      flex: 1
      min-width: 0
      .title
        ellipsis()
        color: var(--color-text)
      .desc
        margin-top: 0.25rem
        ellipsis()
        color: var(--color-text-d)
</style>
