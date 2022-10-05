<template>
  <div class="vm-singer">
    <base-scroll
      class="vm-singer-view"
      ref="scroll"
      :data="singers"
      :probeType="3"
      @scroll="handleScroll"
    >
      <ul>
        <li class="singer-group" ref="singerGroup" v-for="item in singers" :key="item.key">
          <h2 class="shortcut" ref="shortcut">{{item.key}}</h2>
          <ul class="singer-ul">
            <li
              class="singer-li"
              @click="handleClick(singer)"
              v-for="singer in item.data"
              :key="singer.mid"
            >
              <div class="img-wrapper">
                <img class="img" v-lazy="singer.pic" :alt="singer.name" />
              </div>
              <div class="content">
                <span class="text">{{singer.name}}</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <div class="sticky" ref="sticky" :style="stickyStyle" v-show="stickyText">
        <h2 class="shortcut">{{stickyText}}</h2>
      </div>
    </base-scroll>
    <div class="vm-singer-hot">
      <ul
        class="hot-ul"
        @touchstart="handleTouchStart"
        @touchmove.stop.prevent="handleTouchMove"
      >
        <li
          class="hot-li"
          :class="{active: index === current}"
          :data-index="index"
          v-for="(item, index) in singers"
          :key="item.key"
        >{{item.key}}</li>
      </ul>
    </div>
    <template v-if="!singers.length">
      <base-loading></base-loading>
    </template>
    <router-view></router-view>
  </div>
</template>

<script>
import BaseScroll from '@/components/base-scroll';
import BaseLoading from '@/components/base-loading';
import Singer from '@/common/js/singer';
import { getData } from '@/common/js/dom';
import { getSinger } from '@/services/singer';
import { ERR_OK } from '@/services/config';
import { mapMutations } from 'vuex';

const HOT_KEY = '热';
const HOT_LEN = 10;
const TOP_HEIGHT = 20;

export default {
  name: 'vmSinger',
  data() {
    return {
      // 滚动高度
      scrollY: 0,
      singers: [],
      // 选中的hot
      current: 0,
      // sticky位移的高度
      translateY: 0
    };
  },
  computed: {
    stickyText() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.singers[this.current]?.key || '';
    },
    stickyStyle() {
      return {
        transform: `translateY(${this.translateY}px)`
      };
    },
  },
  watch: {
    singers() {
      this.$nextTick(() => {
        this._calcHeight();
        this.stickyHeight = this.$refs.shortcut[0].getBoundingClientRect().height;
      });
    },
    scrollY(newVal) {
      const list = this.groupsHeight;
      for (let i = 0, len = list.length; i < len; i++) {
        if ((-newVal >= list[i] && -newVal < list[i + 1])) {
          this.current = i;
          this._calcTranslateY(list[i + 1] + newVal);
          return;
        }
      }

      this.current = 0;
    }
  },
  created() {
    this.groupsHeight = [];
    this.touch = {};
    this.stickyHeight = 0;
  },
  mounted() {
    this.getSinger();
  },
  methods: {
    async getSinger() {
      const { code, data } = await getSinger();
      if (code === ERR_OK) {
        this.singers = this._normalize(data.list || []);
      }
    },
    handleClick(item) {
      this.setSinger(item);
      this.$router.push({
        path: `/singer/${item.mid}`
      });
    },
    handleScroll(pos) {
      this.scrollY = pos.y;
    },
    handleTouchStart(e) {
      // 获取当前触摸的位置
      const index = parseInt(getData(e.target, 'index')) || 0;
      // 记录当前的current，供移动时使用
      this.touch.current = index;
      this.touch.startY = e.touches[0].pageY;
      this._scrollTo(index)
    },
    handleTouchMove(e) {
      const delta = e.touches[0].pageY - this.touch.startY;
      const index = (delta / TOP_HEIGHT | 0) + this.touch.current;
      this._scrollTo(index);
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        index = 0;
      }

      // index 在 0 ~ groups.length - 1 范围内
      const groups = this.$refs.singerGroup;
      index = Math.min(groups.length - 1, Math.max(0, index));

      this.$refs.scroll.scrollToElement(this.$refs.singerGroup[index], 0);
    },
    // 根据group的高度和滚动高度之差，计算需要位移的量
    _calcTranslateY(diff) {
      if (diff > 0 && diff < this.stickyHeight) {
        this.translateY = diff - this.stickyHeight;
      } else {
        this.translateY = 0;
      }
    },
    // 计算group区域的高度
    _calcHeight() {
      const groups = this.$refs.singerGroup;
      const heightList = [];

      let height = 0;
      heightList.push(height);
      for (let i = 0, len = groups.length; i < len; i++) {
        const rect = groups[i].getBoundingClientRect();
        height += rect.height;
        heightList.push(height);
      }
      this.groupsHeight = heightList;
    },
    _normalize(data) {
      const map = {
        hot: {
          key: HOT_KEY,
          data: []
        }
      };

      for (let i = 0, len = data.length; i < len; i++) {
        const item = data[i];
        if (i < HOT_LEN) {
          map.hot.data.push(new Singer({
            mid: item.Fsinger_mid,
            name: item.Fsinger_name
          }));
        }

        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            key,
            data: []
          };
        }
        map[key].data.push(new Singer({
          mid: item.Fsinger_mid,
          name: item.Fsinger_name
        }));
      }

      const hot = [];
      const ret = [];
      for (let key in map) {
        const val = map[key];
        if (val.key.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.key === HOT_KEY) {
          hot.push(val);
        }
      }

      ret.sort((a, b) => a.key.charCodeAt(0) - b.key.charCodeAt(0));

      return hot.concat(ret);
    },
    ...mapMutations([
      'setSinger'
    ])
  },
  components: {
    BaseScroll,
    BaseLoading
  }
}
</script>

<style lang="stylus">
  .vm-singer
    position relative
    height: calc(100vh - 5rem)
  .vm-singer-view
    position: relative
    height: 100%
    overflow hidden
    .singer-group
      padding-bottom: 1.25rem
    .sticky
      position: absolute
      top: 0
      width: 100%
    .shortcut
      padding-left: 1.25rem
      height: 1.875rem
      font-size: var(--font-size-small)
      line-height: 1.875rem
      background-color: var(--color-highlight-background)
    .singer-li
      display: flex
      align-items: center
      margin-top: 1.25rem
      padding-left: 1.875rem
      .img-wrapper
        flex: 0 0 3.125rem
        height: 3.125rem
        border-radius: 50%
        overflow: hidden
        .img
          width: 100%
          height: 100%
      .text
        margin-left: 0.85rem
        font-size: var(--font-size-medium)
        color: var(--color-text-l)
  .vm-singer-hot
    position: absolute
    top: 50%
    right: 0
    padding: 10px 0
    border-radius: 10px
    background-color: var(--color-background-d)
    transform: translateY(-50%)
    .hot-li
      width: 20px
      font-size: var(--font-size-small)
      line-height: 20px
      text-align: center
      color: var(--color-text-l)
      &.active
        color: var(--color-theme)
</style>
