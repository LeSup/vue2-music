<template>
  <div class="vm-recommend">
    <base-scroll class="vm-recommend-wrapper" ref="scroll" :data="list">
      <div class="vm-recommend-inner">
        <!-- sliders数据加载完成后，才能初始化scroll组件 -->
        <template v-if="sliders.length">
          <base-slide :loop="true" :auto-play="true" :showDots="true">
            <div v-for="item in sliders" :key="item.id">
              <a class="base-slide-item-a" :href="item.link">
                <img class="base-slide-item-img" @load="loadImage" :src="item.pic" alt="" />
              </a>
            </div>
          </base-slide>
        </template>
        <div class="vm-recommend-hot">
          <h2 class="vm-recommend-hot-title">热门歌单推荐</h2>
          <ul class="vm-recommend-hot-ul">
            <li class="vm-recommend-hot-li" @click="handleClick(item)" v-for="item in albums" :key="item.id">
              <div class="img-wrapper">
                <img class="img" v-lazy="item.pic" alt="">
              </div>
              <div class="content">
                <p class="name">{{item.username}}</p>
                <p class="desc">{{item.title}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </base-scroll>
    <template v-if="!albums.length">
      <base-loading></base-loading>
    </template>
    <router-view></router-view>
  </div>
</template>

<script>
import BaseScroll from '@/components/base-scroll';
import BaseSlide from '@/components/base-slide';
import BaseLoading from '@/components/base-loading';
import { getRecommend } from '@/services/recommend';
import { mapMutations } from 'vuex';

export default {
  name: 'vmRecommend',
  data() {
    return {
      albums: [],
      sliders: []
    }
  },
  computed: {
    list() {
      return [].concat(this.albums, this.sliders);
    }
  },
  created() {
    this._getRecommend();
  },
  methods: {
    async _getRecommend() {
      const { albums, sliders } = await getRecommend();
      this.albums = albums;
      this.sliders = sliders;
    },
    loadImage() {
      if (this.checkLoaded) {
        return;
      }
      this.checkLoaded = true;
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 20);
    },
    handleClick(item) {
      this.setAlbum(item);
      this.$router.push({
        path: `/recommend/${item.id}`,
      });
    },
    ...mapMutations([
      'setAlbum'
    ])
  },
  components: {
    BaseScroll,
    BaseSlide,
    BaseLoading
  }
}
</script>

<style lang="stylus">
  .vm-recommend
    position relative
    height: calc(100vh - 5rem)
  .vm-recommend-wrapper
    height: 100%
    overflow: hidden
  .base-slide-item-a
    display: block
  .base-slide-item-img
    width: 100%
  .vm-recommend-hot-title
    height: 3.75rem
    font-size: var(--font-size-medium)
    line-height: 3.75rem
    color: var(--color-theme)
    text-align: center
  .vm-recommend-hot-ul
    padding: 0 1.25rem 1.25rem
  .vm-recommend-hot-li
    display: flex
    align-items: center
    &:not(:last-child)
      margin-bottom: 1.25rem
    .img-wrapper
      flex: 0 0 3.75rem
      height: 3.75rem
      .img
        width: 100%
        height: 100%
    .content
      display: flex
      flex-direction: column
      justify-content: center
      margin-left: 0.75rem
      padding: 0.25rem 0
      font-size: var(--font-size-small)
      line-height: 1.625rem
      .desc
        color: var(--color-text-d)
</style>
