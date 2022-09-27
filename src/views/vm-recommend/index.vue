<template>
  <div class="vm-recommend">
    推荐
  </div>
</template>

<script>
import { getRecommend } from '@/services/recommend'
export default {
  name: 'vmRecommend',
  data() {
    return {
      recommendList: []
    }
  },
  created() {
    // this._getRecommend();
  },
  methods: {
    async _getRecommend() {
      const { albums, sliders } = await getRecommend();
      console.log(albums, sliders);
    }
  }
}
</script>

<style>

</style>
