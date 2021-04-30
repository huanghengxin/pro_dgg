export default {
  state: {
    historyList: [],
  },
  mutations: {
    saveHistory(state, value) {
      if (!value) return;
      if (!state.historyList.includes(value)) {
        state.historyList.unshift(value);
      }
      if (state.historyList.length === 6) {
        state.historyList.pop();
      }
    },
    clearHistory(state) {
      state.historyList = [];
    },
    delHistory(state, index) {
      state.historyList.splice(index, 1);
    },
  },
};
