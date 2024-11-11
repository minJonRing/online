import { createStore } from 'vuex'
import System from './modules/system'
import getters from './getters'


const store = new createStore({
  modules: {
    System
  },
  getters
})

export default store
