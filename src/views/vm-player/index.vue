<template>
  <div class="vm-player" v-show="sequenceList.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="bg-wrapper">
          <img class="bg" :src="currentSong.pic" :alt="currentSong.name" />
        </div>
        <div class="header">
          <div class="back" @click="toggleFullScreen">
            <i class="icon icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subTitle">{{currentSong.singer}}</h2>
        </div>
        <div
          class="middle"
          @touchstart="touchStart"
          @touchmove="touchMove"
          @touchend="touchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper">
              <div class="cd" ref="cd">
                <img class="image" :class="cdCls" :src="currentSong.pic" :alt="currentSong.name" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <p class="playing-lyric">{{txt}}</p>
            </div>
          </div>
          <div class="middle-r" ref="middleR">
            <base-scroll class="lyric-wrapper" ref="lyric" :data="lyric?.lines || []">
              <ul class="lyric-ul">
                <template v-if="lyric">
                  <li
                    class="lyric-li"
                    :class="{active: lineNum === index}"
                    ref="lyricLine"
                    v-for="(line, index) in lyric?.lines"
                    :key="index"
                  >
                    {{line.txt}}
                  </li>
                </template>
              </ul>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{pureMusicLyric}}</p>
              </div>
            </base-scroll>
          </div>
        </div>
        <div class="footer">
          <div class="dots">
            <span class="dot" :class="{active: active === 'cd'}"></span>
            <span class="dot" :class="{active: active === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <div class="time time-l">{{ _format(currentTime) }}</div>
            <div class="progress-bar-wrapper">
              <base-progress-bar :percent="percent" @change="handleChange"></base-progress-bar>
            </div>
            <div class="time time-r">{{ _format(currentSong.duration) }}</div>
          </div>
          <div class="operators">
            <div class="i-wrapper i-left" @click="changeMode">
              <i class="icon" :class="modeCls"></i>
            </div>
            <div class="i-wrapper i-left" :class="{disabled}" @click="handlePrev">
              <i class="icon icon-prev"></i>
            </div>
            <div class="i-wrapper i-center" :class="{disabled}" @click="togglePlaying">
              <i class="icon" :class="iconPlay"></i>
            </div>
            <div class="i-wrapper i-right" :class="{disabled}" @click="handleNext">
              <i class="icon icon-next"></i>
            </div>
            <div class="i-wrapper i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="toggleFullScreen">
        <div class="cd-wrapper">
          <div class="cd">
            <img class="image" :class="cdCls" :src="currentSong.pic" :alt="currentSong.name" />
          </div>
        </div>
        <div class="text">
          <h2 class="name">{{ currentSong.name }}</h2>
          <p class="desc">{{ currentSong.singer }}</p>
        </div>
        <div class="control">
          <base-progress-circle :diameter="diameter" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </base-progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      ref="audio"
      :src="currentSong.url"
      @loadedmetadata="handleLoaded"
      @timeupdate="handleTimeUpdate"
      @ended="handleEnded"
      @error="handleError"
    />
  </div>
</template>

<script>
import Lyric from 'lyric-parser';
import BaseScroll from '@/components/base-scroll';
import BaseProgressBar from '@/components/base-progress-bar';
import BaseProgressCircle from '@/components/base-progress-circle';
import animations from 'create-keyframe-animation';
import { mapGetters, mapMutations } from 'vuex';
import { PlayMode } from '@/common/js/config';
import { shuffle } from '@/common/js/utils';
import { getLyric } from '@/services/song';

export default {
  name: 'vmPlayer',
  data() {
    return {
      // 控制组件是否禁用
      disabled: true,
      // 音频当前播放时长
      currentTime: 0,
      // 迷你播放器进度条的直径
      diameter: 32,
      // Lyric实例
      lyric: null,
      // 当前歌词
      txt: '',
      // 当前歌词行
      lineNum: 0,
      active: 'cd',
    }
  },
  computed: {
    iconPlay() {
      return this.playing ? 'icon-play' : 'icon-pause';
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
    },
    cdCls() {
      return this.playing && !this.disabled ? 'play' : 'pause';
    },
    modeCls() {
      return this.playMode === PlayMode.sequence ? 'icon-sequence' : this.playMode === PlayMode.random ? 'icon-random' : 'icon-loop';
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    pureMusicLyric() {
      if (this.lyric?.lines?.length === 0) {
        return this.lyric.lrc.replace(/\[\d{2}:\d{2}:\d{2}\]/, '');
      } else {
        return '';
      }
    },
    ...mapGetters([
      'playList',
      'sequenceList',
      'currentIndex',
      'currentSong',
      'fullScreen',
      'playMode',
      'playing'
    ])
  },
  watch: {
    currentSong(newVal, oldVal) {
      if (!newVal?.id || newVal.id === oldVal.id) {
        return;
      }
      this.disabled = true;
      this.txt = '';
      this.lineNum = 0;
      this.$nextTick(() => {
        this.getLyric();
      });
    },
    playing(newVal) {
      this.$nextTick(() => {
        const audio = this.$refs.audio;
        newVal ? audio.play() : audio.pause();
      });
    }
  },
  created() {
    this.touch = {};
  },
  methods: {
    getLyric() {
      getLyric(this.currentSong).then(result => {
        this.currentSong.lyric = result;

        this.lyric?.stop();
        this.lyric = new Lyric(result, this.handleLyric);
        if (this.playing) {
          this.lyric.seek(this.currentTime);
        }
      }).catch(() => {
        this.lyric = null;
        this.txt = '';
        this.lineNum = 0;
      });
    },
    handleLyric({ txt, lineNum }) {
      if (!this.$refs.lyricLine) {
        return;
      }
      this.txt = txt;
      this.lineNum = lineNum;
      if (lineNum > 5) {
        this.$refs?.lyric.scrollToElement(this.$refs.lyricLine[lineNum - 5], 1000);
      } else {
        this.$refs?.lyric.scrollTo(0, 0, 1000);
      }
    },
    toggleFullScreen() {
      this.setFullScreen(!this.fullScreen);
    },
    togglePlaying() {
      if (this.disabled) {
        return;
      }

      this.lyric?.togglePlay();
      this.setPlaying(!this.playing);
    },
    handleChange(percent) {
      const currentTime = percent * this.currentSong.duration;
      this.$refs.audio.currentTime = currentTime;
      this.lyric?.seek(currentTime * 1000);

      if (!this.playing) {
        this.togglePlaying();
      }
    },
    handlePrev() {
      if (this.disabled) {
        return;
      }
      let index = this.currentIndex;
      if (index === 0) {
        index = this.playList.length - 1;
      } else {
        index--;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.setPlaying(true);
      }
    },
    handleNext() {
      if (this.disabled) {
        return;
      }
      let index = this.currentIndex;
      if (index === this.playList.length - 1) {
        index = 0;
      } else {
        index++;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.setPlaying(true);
      }
    },
    changeMode() {
      const mode = (this.playMode + 1) % 3;
      if (mode === PlayMode.random) {
        const randomList = shuffle(this.sequenceList);
        const currentIndex = randomList.findIndex(item => item.id === this.currentSong.id);
        this.setPlayList(randomList);
        this.setCurrentIndex(currentIndex);
      }
      this.setPlayMode(mode);
    },
    handleLoaded() {
      this.disabled = false;
      if (this.playing) {
        this.$refs.audio.play();
      } else {
        this.$refs.audio.pause();
      }
    },
    handleTimeUpdate(e) {
      this.currentTime = e.target.currentTime;
    },
    handleEnded() {
      if (this.playMode === PlayMode.loop) {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
      } else {
        this.handleNext();
      }
    },
    handleError() {
      this.disabled = false;
    },
    touchStart(e) {
      this.touch = {
        initiated: true,
        startX: e.touches[0].pageX,
        startY: e.touches[0].pageY
      };
    },
    touchMove(e) {
      if (!this.touch.initiated) {
        return;
      }

      const deltaX = e.touches[0].pageX - this.touch.startX;
      const deltaY = e.touches[0].pageY - this.touch.startY;
      if (
        Math.abs(deltaX) < Math.abs(deltaY) ||
        (this.active === 'cd' && deltaX > 0)
      ) {
        this.touch.initiated = false;
        return;
      }

      const clientWidth = document.documentElement.clientWidth;

      const left = this.active === 'cd' ? 0 : -clientWidth;
      const translateX = Math.min(0, Math.max(-clientWidth, left + deltaX));
      this.touch.percent = Math.abs((left + deltaX) / clientWidth);

      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.middleL.style.transitionDuration = '0ms';
      this.$refs.middleR.style.transform = `translateX(${translateX}px)`;
      this.$refs.middleR.style.transitionDuration = '0ms';
    },
    touchEnd() {
      if (!this.touch.initiated) {
        return;
      }

      const clientWidth = document.documentElement.clientWidth;

      let active;
      let opacity;
      let translateX;
      if (this.active === 'cd') {
        if (this.touch.percent >= 0.1) {
          translateX = -clientWidth;
          opacity = 0;
          active = 'lyric';
        } else {
          translateX = 0;
          opacity = 1;
          active = 'cd';
        }
      } else if (this.active === 'lyric') {
        if (this.touch.percent <= 0.9) {
          translateX = 0;
          opacity = 1;
          active = 'cd';
        } else {
          translateX = -clientWidth;
          opacity = 0;
          active = 'lyric';
        }
      }

      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style.transitionDuration = '300ms';
      this.$refs.middleR.style.transform = `translateX(${translateX}px)`;
      this.$refs.middleR.style.transitionDuration = '300ms';
      this.active = active;
      this.touch.initiated = false;
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      animations.registerAnimation({
        name: 'move',
        animation: {
          0: {
            transform: `translate(${x}px, ${y}px) scale(${scale})`
          },
          60: {
            transform: 'translate(0, 0) scale(1.1)'
          },
          100: {
            transform: 'translate(0, 0) scale(1)'
          }
        },
        presets: {
          duration: 400,
          easing: 'linear'
        }
      });

      animations.runAnimation(this.$refs.cd, 'move', done);
    },
    afterEnter() {
      animations.unregisterAnimation('move');
      this.$refs.cd.style.animation = '';
    },
    leave(el ,done) {
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cd.style.transition = 'transform 0.4s';
      this.$refs.cd.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      this.$refs.cd.addEventListener('transitionend', done);
    },
    afterLeave() {
      this.$refs.cd.style.transition = '';
      this.$refs.cd.style.transform = '';
    },
    _format(time) {
      const minute = Math.floor(time / 60);
      const second = Math.floor(time % 60);
      return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    },
    _getPosAndScale() {
      const width = window.innerWidth * 0.8;
      const x = 20 + 20 - (window.innerWidth / 2);
      const y = (window.innerHeight - 30) - (width / 2 + 80);
      const scale = 40 / width;
      return {
        x,
        y,
        scale
      };
    },
    ...mapMutations([
      'setFullScreen',
      'setCurrentIndex',
      'setPlayList',
      'setPlayMode',
      'setPlaying'
    ])
  },
  components: {
    BaseScroll,
    BaseProgressBar,
    BaseProgressCircle
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/mixin'

  .normal-player
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    background-color: var(--color-background)
    overflow: hidden
    &.normal-enter-active, &.normal-leave-active
      transition: opacity 0.4s
      .header, .footer
        transition: transform 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .header
        transform: translateY(-100%)
      .footer
        transform: translateY(100%)
    .bg-wrapper
      position: absolute
      top: 0
      right: 0
      bottom: 0
      left: 0
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
      .bg
        width: 100%
        height: 100%
        object-fit: cover
    .header
      position: relative
      padding: 0 2.5rem
      text-align: center
      color: var(--color-text)
      .back
        position: absolute
        top: 0
        left: 0
        .icon-back
          display: block
          padding: 0.625rem
          font-size: var(--font-size-large-x)
          color: var(--color-theme)
          transform: rotate(-90deg)
      .title
        font-size: var(--font-size-large)
        line-height: 2.5rem
        ellipsis()
      .subTitle
        font-size: var(--font-size-medium)
        line-height: 1
        ellipsis()
    .middle
      position: absolute
      top: 80px
      bottom: 170px
      width: 100%
      white-space: nowrap
      font-size: 0
      .middle-l, .middle-r
        display: inline-block
        width: 100%
        height: 100%
        vertical-align: top
        transition-property: transform
      .cd-wrapper
        position: relative
        margin: 0 auto
        width: 80%
        padding-bottom: 80%
        .cd
          position: absolute
          top: 0
          right: 0
          bottom: 0
          left: 0
          .image
            width: 100%
            height: 100%
            border-radius: 50%
            border: 10px solid rgba(255, 255, 255, 0.1)
            box-sizing: border-box
            animation: rotate 20s linear infinite
            &.play
              animation-play-state: running
            &.pause
              animation-play-state: paused
      .playing-lyric-wrapper
        margin: 1.875rem 15% 0
        text-align: center
        overflow: hidden
        .playing-lyric
          font-size: var(--font-size-medium)
          list-style: 1.25rem
          color: var(--color-text-l)
      .lyric-wrapper
        height: 100%
        text-align: center
        overflow: hidden
        .lyric-li
          font-size: var(--font-size-medium)
          line-height: 2rem
          color: var(--color-text-l)
          ellipsis()
          &.active
            color: var(--color-text)
        .pure-music
          padding-top: 50%
          line-height: 2rem
          color: var(--color-text-l)
          font-size: var(--font-size-medium)
    .footer
      position: absolute
      right: 0
      bottom: 0
      left: 0
      padding-bottom: 20px
      .dots
        margin: 20px 0
        text-align: center
        font-size: 0
        .dot
          display: inline-block
          width: 8px
          height: 8px
          border-radius: 4px
          background-color: var(--color-text-l)
          &:not(:last-child)
            margin-right: 4px
          &.active
            width: 20px
            background-color: var(--color-text-ll)
      .progress-wrapper
        display: flex
        justify-content: center
        align-items: center
        margin: 20px auto
        width: 80%
        font-size: var(--font-size-small)
        .progress-bar-wrapper
          flex: 1
        .time-l
          margin-right: 6px
        .time-r
          margin-left: 6px
      .operators
        display: flex
        justify-content: space-evenly
        align-items: center
        margin: 20px 0
        .i-wrapper
          flex: 1
          color: var(--color-theme)
          &.disabled
            color: var(--color-theme-d)
          .icon
            font-size: 30px
        .i-left
          text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          .icon
            font-size: 40px
        .i-right
          text-align: left
        .icon-favorite
          color: var(--color-sub-theme)
  .mini-player
    position: fixed
    right: 0
    bottom: 0
    left: 0
    display: flex
    align-items: center
    height: 60px
    background-color: var(--color-highlight-background)
    overflow: hidden
    &.mini-enter-active, &.mini-leave-active
      transition: opacity 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .cd-wrapper
      flex: 0 0 40px
      margin-left: 20px
      height: 40px
      .cd
        height: 100%
        .image
          width: 100%
          height: 100%
          border-radius: 50%
          animation: rotate 20s linear infinite
          &.play
            animation-play-state: running
          &.pause
            animation-play-state: paused
    .text
      flex: 1
      margin-left: 10px
      line-height: 20px
      min-height: 0
      .name
        margin-bottom: 2px
        font-size: var(--font-size-medium)
        color: var(--color-text)
        ellipsis()
      .desc
        font-size: var(--font-size-small)
        color: var(--color-text-d)
        ellipsis()
    .control
      flex: 0 0 30px
      margin: 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size: 30px
        color: var(--color-theme-d)
      .icon-mini
        position: absolute
        left: 0
        font-size: 32px

  @keyframes rotate
    from
      transform: rotate(0)
    to
      transform: rotate(360deg)
</style>
