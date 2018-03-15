import { getMeta } from '@/api/getMeta'

const permission = {
  // 数据
  state: {
    routers: [],
    auths: [],
    username: '',
    func: []
  },
  // 定义方法名
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.routers = routers
    },
    SET_AUTHS: (state, auths) => {
      state.auths = auths
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_FUNC: (state, func) => {
      state.func = func
    }
  },
  // 执行方法
  actions: {
    GenerateRouters ({ commit }) {
      return new Promise((resolve, reject) => {
        getMeta().then(res => {
          commit('SET_ROUTERS', res.menu)
          commit('SET_AUTHS', res.authUrl)
          commit('SET_USERNAME', res.displayName || 'Admin')
          commit('SET_FUNC', res.func)
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      })
    }
  },
  // 取值
  getters: {
    permission_routers: state => state.routers,
    auth_routers: state => state.auths,
    user_name: state => state.username,
    func: state => state.func
  }
}

export default permission
