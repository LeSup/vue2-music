import { PlayMode } from '@/common/js/config';
import { loadSearch, loadPlay, loadFavorite } from '@/common/js/cache';

export default {
  album: {},
  singer: {},
  rank: {},
  playList: [],
  sequenceList: [],
  playMode: PlayMode.sequence,
  playing: false,
  currentIndex: -1,
  fullScreen: false,
  searchHistory: loadSearch(),
  playHistory: loadPlay(),
  favoriteList: loadFavorite()
}
