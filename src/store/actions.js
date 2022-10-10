import { PlayMode } from '@/common/js/config';
import { shuffle } from '@/common/js/utils';

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
