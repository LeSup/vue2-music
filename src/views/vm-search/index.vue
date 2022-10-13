<template>
  <div class="search">
    <div class="search-box-wrapper">
      <base-search-box v-model="search"></base-search-box>
    </div>
    <div class="search-content" v-if="!search">
      <div class="hot">
        <div class="hot-title">热门搜索</div>
        <ul class="hot-ul">
          <li class="hot-li" @click="clickHotKey(item.key)" v-for="item in hotKeys" :key="item.id">
            {{item.key}}
          </li>
        </ul>
      </div>
      <div class="history">
        <div class="history-header">
          <span>搜索历史</span>
          <span class="icon-wrapper" @click="clearHistory">
            <i class="icon icon-clear"></i>
          </span>
        </div>
        <div class="history-list-wrapper">
          <base-delete-list :data="history" @click="clickHistoryItem" @delete="deleteHistoryItem"></base-delete-list>
        </div>
      </div>
    </div>
    <div class="result-wrapper" v-if="search">
      <base-search-result :value="search"></base-search-result>
    </div>
  </div>
</template>

<script>
import BaseSearchBox from '@/components/base-search-box';
import BaseDeleteList from '@/components/base-delete-list';
import BaseSearchResult from '@/components/base-search-result';
import { getHotKeys } from '@/services/search';

export default {
  name: 'vmSearch',
  data() {
    return {
      search: '',
      hotKeys: [],
      history: ['阿斯蒂芬', '暗示的', '蛋蔬夫妻', '挨个和', '安问题', '娓娓而谈']
    }
  },
  mounted() {
    this.getHotKeys();
  },
  methods: {
    clickHotKey(value) {
      this.search = value;
    },
    clearHistory() {

    },
    clickHistoryItem(value) {
      this.search = value;
    },
    deleteHistoryItem(index) {
      console.log(index);
    },
    async getHotKeys() {
      const { hotKeys } = await getHotKeys();
      this.hotKeys = hotKeys;
    }
  },
  components: {
    BaseSearchBox,
    BaseDeleteList,
    BaseSearchResult
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
    .hot-title
      padding: 0 1.25rem
      font-size: var(--font-size-medium)
      line-height: 2rem
      color: var(--color-text-l)
    .hot-ul
      display: flex
      flex-wrap: wrap
      gap: 0.5rem
      padding: 0.5rem 1.25rem
      .hot-li
        padding: 0.25rem 0.5rem
        font-size: var(--font-size-medium)
        border-radius: 0.6875rem
        color: var(--color-text-d)
        background-color: var(--color-highlight-background)
    .history-header
      display: flex
      justify-content: space-between
      align-items: center
      padding: 0 1.25rem
      height: 2rem
      font-size: var(--font-size-medium)
      color: var(--color-text-l)
      .icon-wrapper
        spread-area()
    .history-list-wrapper
      padding: 0.5rem 1.25rem
  .result-wrapper
    height: calc(100vh - 9.5rem)
    overflow: hidden
</style>
