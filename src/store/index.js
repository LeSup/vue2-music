import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger";
import * as actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";
import state from "./state";

const debug = process.env.NODE_ENV !== "production";

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
