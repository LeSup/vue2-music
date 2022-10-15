<template>
  <div class="search-box">
    <i class="icon icon-search"></i>
    <input class="input" :placeholder="placeholder" v-model="text" />
    <i class="icon icon-dismiss" v-show="value" @click="click"></i>
  </div>
</template>

<script>
import { debounce } from '@/common/js/utils';

export default {
  name: 'baseSearchBox',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '搜索歌手、歌曲'
    }
  },
  data() {
    return {
      text: this.value
    };
  },
  watch: {
    value(newVal) {
      this.text = newVal;
    }
  },
  mounted() {
    this.$watch('text', debounce(() => {
      this.$emit('input', this.text);
    }));
  },
  methods: {
    click() {
      this.text = '';
    }
  }
}
</script>

<style lang="stylus">
  .search-box
    position: relative
    .icon-search
      position: absolute
      top: 0.375rem
      left: 0.375rem
      font-size: var(--font-size-large-x)
      color: var(--color-text-l)
    .input
      width: 100%
      height: 2rem
      padding: 0 2rem
      font-size: var(--font-size-medium)
      border-radius: 0.375rem
      box-sizing: border-box
      color: var(--color-text-l)
      background-color: var(--color-highlight-background)
    .icon-dismiss
      position: absolute
      top: 0.5625rem
      right: 0.5625rem
      font-size: var(--font-size-medium)
      color: var(--color-text-l)
</style>
