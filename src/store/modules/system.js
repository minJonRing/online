import dayjs from 'dayjs'

const state = {
  active: 0,
}

const mutations = {
  Set_Active: (state, active) => {
    state.active = active
  },
}

const actions = {
  // user login
  setActive({ commit }, active) {
    commit('Set_Active', active)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
