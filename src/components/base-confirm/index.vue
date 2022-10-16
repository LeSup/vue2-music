<template>
  <transition name="fade">
    <div class="confirm" @click.stop v-show="visible">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div class="operate-btn" @click="cancel">{{cancelText}}</div>
            <div class="operate-btn" @click="ok">{{okText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'baseConfirm',
  props: {
    text: {
      type: String,
      default: '',
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    okText: {
      type: String,
      default: '确认'
    }
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
    },
    cancel() {
      this.hide();
      this.$emit('cancel');
    },
    ok() {
      this.hide();
      this.$emit('ok');
    }
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/mixin'

  .confirm
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    background: var(--color-background-d)
    backdrop-filter-blur(5px)
    &.fade-enter-active
      animation: fadeIn 0.3s
      .confirm-content
        animation: zoom 0.3s
    &.fade-leave-active
      animation: fadeIn 0.3s reverse
      .confirm-content
        animation: zoom 0.3s reverse
  .confirm-wrapper
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
  .confirm-content
    width: 16.875rem
    border-radius: 0.75rem
    background: var(--color-highlight-background)
    .text
      padding: 1.25rem 1rem
      font-size: var(--font-size-large)
      line-height: 1.375rem
      text-align: center
      color: var(--color-text-l)
    .operate
      display: flex
      font-size: var(--font-size-medium-x)
      line-height: 1.375rem
      text-align: center
      color: var(--color-text-d)
      .operate-btn
        flex: 1
        padding: 0.625rem 0
        border-top: 1px solid var(--color-background-d)
        &:first-child
          border-right: 1px solid var(--color-background-d)
  @keyframes fadeIn
    from
      opacity: 0
    to
      opacity: 1
  @keyframes zoom
    0%
      transform: scale(0)
    60%
      transform: scale(1.1)
    100%
      transform: scale(1)
</style>
