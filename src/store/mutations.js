export default {
  setAlbum(state, album) {
    state.album = album;
  },
  setSinger(state, singer) {
    state.singer = singer;
  },
  setRank(state, rank) {
    state.rank = rank;
  },
  setPlayList(state, list) {
    state.playList = list;
  },
  setSequenceList(state, list) {
    state.sequenceList = list;
  },
  setPlayMode(state, playMode) {
    state.playMode = playMode;
  },
  setPlaying(state, playing) {
    state.playing = playing;
  },
  setCurrentIndex(state, index) {
    state.currentIndex = index;
  },
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen;
  },
  setSearchHistory(state, list) {
    state.searchHistory = list;
  },
  setPlayHistory(state, list) {
    state.playHistory = list;
  },
  setFavoriteList(state, list) {
    state.favoriteList = list;
  }
}
