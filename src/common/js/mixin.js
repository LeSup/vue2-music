import { mapActions, mapGetters, mapMutations } from 'vuex';
import { shuffle } from '@/common/js/utils';
import { PlayMode } from '@/common/js/config';

export const playListMixin = {
  computed: {
    ...mapGetters(['playList'])
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal);
    }
  },
  mounted() {
    this.handlePlayList(this.playList);
  },
  activated() {
    this.handlePlayList(this.playList);
  },
  methods: {
    handlePlayList() {
      throw new Error('must be');
    }
  }
}

export const playerMixin = {
  computed: {
    modeCls() {
      return this.playMode === PlayMode.sequence ? 'icon-sequence' : this.playMode === PlayMode.random ? 'icon-random' : 'icon-loop';
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playMode',
    ])
  },
  methods: {
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
    ...mapMutations([
      'setCurrentIndex',
      'setPlayList',
      'setPlayMode',
    ])
  }
}

export const searchMixin = {
  data() {
    return {
      search: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    clickSearch(value) {
      this.search = value;
    },
    deleteSearch(index) {
      this.removeSearchHistory(this.searchHistory[index]);
    },
    selectSearch() {
      this.saveSearchHistory(this.search);
    },
    ...mapActions([
      'saveSearchHistory',
      'removeSearchHistory'
    ])
  }
}
