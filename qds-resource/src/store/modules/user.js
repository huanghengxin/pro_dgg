import { UserApi } from 'api/user';
import Vue from 'vue';
import store from 'storejs';
import router from 'router';
const state = {
  userInfo: null, // 用户信息
  loginLoading: false, // 登录状态
  fullName: '',
};
// actions
const actions = {
  // 退出登录
  Logout({ commit }) {
    // 清空vuex
    commit('SET_USERINFO', null);
    commit('SET_ADDROUTES', null);
    // 移除local
    localStorage.clear();
    router.push('/login');
  },
  // 登录
  async Login({ commit, dispatch }, { account, password, platformType }) {
    commit('SET_LOGINLOADING', true);
    try {
      const res = await UserApi.login({
        accountChannel: 'AUTH_PHONE_PWD',
        userType: 'MERCHANT_USER',
        client: 'COMDIC_TERMINAL_PC',
        platformType,
        dataJson: {
          phone: account,
          password: password,
        },
      });
      if (res.code === 200) {
        console.log(res, 'res');
        const { token, userId, mchInfo, userType } = res.data;
        store.set('token', token);
        store.set('userType', userType);
        store.set('userId', userId);
        store.set('mchInfo', mchInfo);
        await dispatch('getUserAuthInfo');
        router.push('/add-source');
      } else {
        Vue.prototype.$message.warning(res.message);
      }
      commit('SET_LOGINLOADING', false);
    } catch (error) {
      commit('SET_LOGINLOADING', false);
    }
  },
  // 获取当前用户信息
  getUserAuthInfo({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      let promiseList = [];
      promiseList.push(
        UserApi.getUserInfo({
          id: store.get('userId'),
        }),
      );
      // promiseList.push(AppApi.getUserApps());
      Promise.all(promiseList)
        .then((res) => {
          commit('SET_USERINFO', res[0]);
          resolve();
        })
        .catch((error) => {
          dispatch('Logout');
          reject(error);
        });
    });
  },
};

// mutations
const mutations = {
  SET_USERINFO: (state, data) => {
    store.set('userInfo', data?.data);
    store.set('platformType', 'COMDIC_PLATFORM_QIDASHUN');
    state.userInfo = data?.data;
    state.fullName = store.get('userInfo').fullName;
  },
  SET_FULLNAME: (state, data) => {
    state.fullName = data === undefined ? store.get('userInfo')?.fullName : data;
  },
  SET_ADDROUTES: (state, data) => {
    state.addRoutes = data;
  },
  SET_LOGINLOADING: (state, status) => {
    state.loginLoading = status;
  },
  SET_ISADDROUTESED: (state, flag) => {
    state.isAddRoutesEd = flag;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
