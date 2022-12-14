<template>
  <transition name="fade">
    <div class="play-list" v-show="visible" @click.stop="hide">
      <div class="container">
        <div class="header">
          <i class="icon" :class="modeCls" @click.stop="changeMode"></i>
          <span class="text">{{modeText}}</span>
          <span class="icon-wrapper" @click.stop="clear">
            <i class="icon-clear"></i>
          </span>
        </div>
        <base-scroll class="main" ref="scroll" :data="sequenceList">
          <transition-group class="list" name="delete" tag="ul">
            <li
              class="item"
              ref="playSong"
              v-for="item in sequenceList"
              :key="item.id"
            >
              <span class="icon-wrapper">
                <i class="icon-play" v-if="showIcon(item)"></i>
              </span>
              <span class="name" @click.stop="clickItem(item)">{{item.name}}</span>
              <span class="icon-wrapper" @click.stop="toggleFavorite(item)">
                <i :class="[getFavoriteCls(item)]"></i>
              </span>
              <span class="icon-wrapper" @click.stop="deleteItem(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </base-scroll>
        <div class="operate">
          <base-button @click="showAddSong">
            <template #icon>
              <i class="icon icon-add"></i>
            </template>
            <template #text>
              <span class="text">添加歌曲到队列</span>
            </template>
          </base-button>
        </div>
        <div class="footer" @click.stop="hide">
          <span>关闭</span>
        </div>
      </div>
      <vm-add-song ref="addSong"></vm-add-song>
      <base-confirm ref="confirm" text="是否清空播放列表" ok-text="清空" @ok="handleOk"></base-confirm>
    </div>
  </transition>
</template>

<script>
import VmAddSong from '@/views/vm-add-song';
import BaseScroll from '@/components/base-scroll';
import BaseButton from '@/components/base-button';
import BaseConfirm from '@/components/base-confirm';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { PlayMode } from '@/common/js/config';
import { playerMixin } from '@/common/js/mixin';

export default {
  name: 'vmPlayList',
  mixins: [playerMixin],
  data() {
    return {
      visible: false
    }
  },
  computed: {
    modeText() {
      return this.playMode === PlayMode.sequence ? '顺序播放' : this.playMode === PlayMode.random ? '随机播放' : '单曲循环';
    },
    ...mapGetters([
      'playMode',
      'playList',
    ])
  },
  watch: {
    currentSong(newVal, oldVal) {
      if (this.visible && newVal?.id !== oldVal?.id) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.scrollTo();
        }, 500);
      }
    }
  },
  methods: {
    show() {
      this.visible = true;
      // 隐藏时高度计算不正确，需要刷新
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$refs.scroll.refresh();
        this.scrollTo();
      }, 20);
    },
    hide() {
      this.visible = false;
    },
    clear() {
      this.$refs.confirm.show();
    },
    clickItem(item) {
      const index = this.playList.findIndex(i => i.id === item.id);
      this.setCurrentIndex(index);
      this.setPlaying(true);
    },
    deleteItem(item) {
      this.removeSong(item);
      if (!this.sequenceList.length) {
        this.hide();
      }
    },
    handleOk() {
      this.clearSongList();
      this.hide();
    },
    showAddSong() {
      this.$refs.addSong.show();
    },
    scrollTo() {
      const index = this.sequenceList.findIndex(i => i.id === this.currentSong.id);
      this.$refs.scroll.scrollToElement(this.$refs.playSong[index], 0);
    },
    showIcon(item) {
      return item.id === this.currentSong.id;
    },
    ...mapActions([
      'clearSongList',
      'removeSong'
    ]),
    ...mapMutations([
      'setPlaying'
    ])
  },
  components: {
    VmAddSong,
    BaseScroll,
    BaseButton,
    BaseConfirm
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/mixin'

  .play-list
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    background-color: var(--color-background-l)
    backdrop-filter-blur(3px)
    &.fade-enter-active, &.fade-leave-active
      transition: opacity 0.3s
      .container
        transition: transform 0.3s
    &.fade-enter, &.fade-leave-to
      opacity: 0
      .container
        transform: translateY(100%)
    .container
      position: absolute
      right: 0
      bottom: 0
      left: 0
      background: var(--color-highlight-background)
      .header
        display: flex
        align-items: center
        padding: 0 1.25rem
        height: 3.75rem
        .icon
          font-size: var(--font-size-large-xx)
          color: var(--color-theme)
        .text
          margin-left: 0.5rem
          font-size: var(--font-size-medium)
          color: var(--color-text-l)
        .icon-wrapper
          margin-left: auto
          spread-area()
          .icon-clear
            font-size: var(--font-size-small)
            color: var(--color-text-d)
      .main
        max-height: 15rem
        overflow: hidden
        .list
          height: 100%
        .item
          display: flex
          align-items: center
          padding: 0 1.25rem
          height: 2rem
          overflow: hidden
          &.delete-leave-active
            transition: height 0.3s
          &.delete-leave-to
            height: 0
          .icon-wrapper
            flex: 0 0 .75rem
            font-size: var(--font-size-small)
            color: var(--color-theme)
            spread-area()
            &:not(:first-child)
              margin-left: 0.5rem
            .icon-favorite
              color: var(--color-sub-theme)
          .name
            margin: 0 auto 0 0.5rem
            font-size: var(--font-size-medium)
            color: var(--color-text-l)
            ellipsis()
            min-width: 0
      .operate
        display: flex
        align-items: center
        height: 4.5rem
      .footer
        height: 3.125rem
        font-size: var(--font-size-medium-x)
        line-height: 3.125rem
        text-align: center
        color: var(--color-text-l)
        background-color: var(--color-background)
</style>
