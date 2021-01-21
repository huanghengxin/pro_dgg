/**
 * 用户管理全局状态
 * @author chenmb
 * @since 2020/11/12
 */

const state = {
  businessCode: [false, false, true],
  businessData: null,
  productData: null,
};

const mutations = {
  editBusinessCode(state, payload) {
    state.businessCode[payload.index] = payload.flag;
    console.log(state.businessCode, 'state.businessCode');
  },
  editBusinessData(state, payload) {
    state.businessData = payload;
    console.log(state.businessData, 'state.businessData');
  },
  editProductData(state, payload) {
    state.productData = payload;
    console.log(state.productData, 'state.productData');
  },
};

const actions = {
  //   async fetch({ state, commit }) {
  //     let list = [];
  //     try {
  //       const params = { authId: '7715741018907525120' };
  //       list = await getList(params);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     commit('setList', list);
  //   },
};

export default { namespaced: true, state, mutations, actions };
