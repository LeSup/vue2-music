<template>
  <div class="search">
    <div class="search-box-wrapper">
      <base-search-box v-model="search"></base-search-box>
    </div>
    <div class="search-content" ref="content">
      <base-scroll class="shortcut" ref="shortcut" v-if="!search" :data="scrollData">
        <div>
          <div class="hot">
            <div class="header">
              <span>热门搜索</span>
            </div>
            <ul class="ul">
              <li class="li" @click="clickHotKey(item.key)" v-for="item in hotKeys" :key="item.id">
                {{item.key}}
              </li>
            </ul>
          </div>
          <div class="history" v-show="searchHistory.length">
            <div class="header">
              <span>搜索历史</span>
              <span class="icon-wrapper" @click="clearHistory">
                <i class="icon icon-clear"></i>
              </span>
            </div>
            <base-delete-list :data="searchHistory" @click="clickSearch" @delete="deleteSearch"></base-delete-list>
          </div>
        </div>
      </base-scroll>
      <base-search-result ref="result" v-if="search" :value="search" @click="selectSearch"></base-search-result>
    </div>
    <base-confirm ref="confirm" text="是否清空所有搜索历史" @ok="confirm"></base-confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import BaseScroll from '@/components/base-scroll';
import BaseSearchBox from '@/components/base-search-box';
import BaseDeleteList from '@/components/base-delete-list';
import BaseSearchResult from '@/components/base-search-result';
import BaseConfirm from '@/components/base-confirm';
import { mapActions } from 'vuex';
import { playListMixin, searchMixin } from '@/common/js/mixin';
import { getHotKeys } from '@/services/search';

export default {
  name: 'vmSearch',
  mixins: [playListMixin, searchMixin],
  data() {
    return {
      hotKeys: [],
    }
  },
  computed: {
    scrollData() {
      return [].concat(this.hotKeys, this.searchHistory);
    },
  },
  mounted() {
    this.getHotKeys();
  },
  methods: {
    async getHotKeys() {
      const { hotKeys } = await getHotKeys();
      this.hotKeys = hotKeys;
    },
    handlePlayList(list) {
      const bottom = list?.length ? '60px' : '0px';
      this.$refs.content.style.height = `calc(100vh - 9.5rem - ${bottom})`;
      this.$refs?.shortcut?.refresh();
      this.$refs?.result?.refresh();
    },
    clickHotKey(value) {
      this.search = value;
    },
    clearHistory() {
      this.$refs.confirm.show();
    },
    confirm() {
      this.clearSearchHistory();
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  components: {
    BaseScroll,
    BaseSearchBox,
    BaseDeleteList,
    BaseSearchResult,
    BaseConfirm
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/mixin'

  .search-box-wrapper
    padding: 1.25rem
  .search-content
    height: calc(100vh - 9.5rem)
    overflow: hidden
    .shortcut
      height: 100%
      .hot
        .header
          padding: 0 1.25rem
          font-size: var(--font-size-medium)
          line-height: 2rem
          color: var(--color-text-l)
        .ul
          display: flex
          flex-wrap: wrap
          gap: 0.75rem
          padding: 0.5rem 1.25rem
          .li
            padding: 0.25rem 0.5rem
            font-size: var(--font-size-medium)
            border-radius: 0.6875rem
            color: var(--color-text-d)
            background-color: var(--color-highlight-background)
      .history
        .header
          display: flex
          justify-content: space-between
          align-items: center
          padding: 0 1.25rem
          height: 2rem
          font-size: var(--font-size-medium)
          color: var(--color-text-l)
          .icon-wrapper
            spread-area()
        .delete-list
          padding: 0.5rem 1.25rem
</style>
