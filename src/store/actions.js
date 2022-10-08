import { PlayMode } from '@/common/js/config';

export function selectPlay({ commit }, { list, index }) {
  commit('setPlayList', list);
  commit('setSequenceList', list);
  commit('setPlayMode', PlayMode.sequence);
  commit('setPlaying', true);
  commit('setCurrentIndex', index);
  commit('setFullScreen', true);
}
