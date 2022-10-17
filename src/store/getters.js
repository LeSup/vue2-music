export default {
  album: state => state.album,
  singer: state => state.singer,
  rank: state => state.rank,
  playList: state => state.playList,
  sequenceList: state => state.sequenceList,
  playMode: state => state.playMode,
  playing: state => state.playing,
  currentIndex: state => state.currentIndex,
  currentSong: state => state.playList[state.currentIndex] || {},
  fullScreen: state => state.fullScreen,
  searchHistory: state => state.searchHistory,
  playHistory: state => state.playHistory,
  favoriteList: state => state.favoriteList
};
