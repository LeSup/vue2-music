<template>
  <base-scroll
    class="search-result"
    ref="scroll"
    :data="data"
    @scrollEnd="scrollEnd"
  >
    <ul class="list">
      <li class="item" @click="clickItem(item)" v-for="item in data" :key="item.id">
        <i class="icon" :class="getIconCls(item)"></i>
        <span class="name">{{item.name}}</span>
      </li>
      <li class="load-more" v-show="hasMore">
        上拉加载更多
      </li>
    </ul>
    <base-loading v-show="loading"></base-loading>
    <base-no-result v-show="!data.length" text="抱歉，暂无搜索结果"></base-no-result>
  </base-scroll>
</template>

<script>
import BaseScroll from '@/components/base-scroll';
import BaseNoResult from '@/components/base-no-result';
import BaseLoading from '@/components/base-loading';
import { search } from '@/services/search';
import { processSongs } from '@/services/song';
import { mapActions, mapMutations } from 'vuex';

const TYPE_SINGER = 'singer';

export default {
  name: 'baseSearchResult',
  props: {
    value: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      page: 1,
      data: [],
      hasMore: false,
      loading: false
    }
  },
  watch: {
    value() {
      this.page = 1;
      this.$nextTick(this.loadData);
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      const { hasMore, singer, songs } = await search(this.value, this.page, this.showSinger);
      const result = await processSongs(songs || [])
      if (singer) {
        result.unshift({ ...singer, type: TYPE_SINGER })
      }
      this.hasMore = hasMore && !!result.length;
      this.data = result;
      this.loading = false;
    },
    async loadMore() {
      this.loading = true;
      const { hasMore, singer, songs } = await search(this.value, this.page, this.showSinger);
      const result = await processSongs(songs || [])
      if (singer) {
        result.unshift({ ...singer, type: TYPE_SINGER })
      }
      this.hasMore = hasMore && !!result.length;
      this.data.push(...songs);
      this.loading = false;
    },
    scrollEnd() {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      this.$nextTick(this.loadMore);
    },
    clickItem(item) {
      if (item.type === TYPE_SINGER) {
        this.setSinger(item);
        this.$router.push({
          path: `/search/${item.mid}`
        });
      } else {
        this.insertSong(item);
      }
      this.$emit('click');
    },
    refresh() {
      this.$refs?.scroll.refresh()
    },
    getIconCls(item) {
      return item.type !== TYPE_SINGER ? 'icon-music' : 'icon-mine';
    },
    ...mapActions([
      'insertSong'
    ]),
    ...mapMutations([
      'setSinger'
    ])
  },
  components: {
    BaseScroll,
    BaseNoResult,
    BaseLoading
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/mixin'

  .search-result
    position: relative
    height: 100%
    overflow: hidden
    .list
      padding: 0 1.25rem 0.75rem
      .item
        display: flex
        align-items: center
        height: 1.5rem
        font-size: var(--font-size-medium)
        color: var(--color-text-l)
        &:not(:first-child)
          margin-top: 0.75rem
        .name
          flex: 1
          margin-left: 0.5rem
          min-width: 0
          ellipsis()
    .load-more
      height: 1.5rem
      font-size: var(--font-size-medium);
      line-height: 1.5rem
      text-align: center
      color: var(--color-text-d);
</style>
