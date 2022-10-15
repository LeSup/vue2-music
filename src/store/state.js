import { PlayMode } from '@/common/js/config';
import { loadSearch } from '@/common/js/cache';

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
  searchHistory: loadSearch()
}
