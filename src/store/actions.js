import { PlayMode } from '@/common/js/config';
import { shuffle } from '@/common/js/utils';
import { saveSearch, removeSearch, clearSearch } from '@/common/js/cache';

export function selectPlay({ commit, state }, { list, index }) {
  if (state.playMode === PlayMode.random) {
    const randomList = shuffle(list);
    index = randomList.findIndex(item => item.id === list[index].id);
    commit('setPlayList', randomList);
  } else {
    commit('setPlayList', list);
  }
  commit('setSequenceList', list);
  commit('setPlaying', true);
  commit('setCurrentIndex', index);
  commit('setFullScreen', true);
}

export function randomPlay({ commit }, { list }) {
  commit('setPlayList', shuffle(list));
  commit('setSequenceList', list);
  commit('setPlayMode', PlayMode.random);
  commit('setPlaying', true);
  commit('setCurrentIndex', 0);
  commit('setFullScreen', true);
}

// 往当前列表中插入歌曲
export function insertSong({ commit, state }, song) {
  const playList = state.playList.slice();
  const sequenceList = state.sequenceList.slice();

  let currentIndex = state.currentIndex;
  let currentSong = playList[currentIndex];
  let playMode = state.playMode;

  let fPIdx = playList.findIndex(i => i.id === song.id);
  playList.splice(currentIndex + 1, 0, song);
  // 1.没找到：当前下标后插入歌曲，并下标加一
  // 2.找到了，并比当前下标靠前：删除存在项，下标不动
  // 3.找到了，并比当前下标靠后：删除存在项，下标不动
  if (fPIdx === -1) {
    currentIndex++;
  } else {
    playList.splice(fPIdx, 1);
  }

  let sIdx = sequenceList.findIndex(i => i.id === currentSong.id);
  let fSIdx = sequenceList.findIndex(i => i.id === song.id);
  sequenceList.splice(sIdx, 0, song);
  if (fPIdx > -1) {
    sequenceList.splice(fSIdx, 1);
  }

  if (playList.length === 1) {
    playMode = PlayMode.loop;
  }

  commit('setPlayList', playList);
  commit('setSequenceList', sequenceList);
  commit('setPlayMode', playMode);
  commit('setPlaying', true);
  commit('setCurrentIndex', currentIndex);
  commit('setFullScreen', true);
}

/* 搜索历史——开始 */
export function saveSearchHistory({ commit }, val) {
  commit('setSearchHistory', saveSearch(val));
}

export function removeSearchHistory({ commit }, val) {
  commit('setSearchHistory', removeSearch(val));
}

export function clearSearchHistory({ commit }) {
  commit('setSearchHistory', clearSearch());
}
/* 搜索历史——结束 */
