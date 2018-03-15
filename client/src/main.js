import Vue from 'vue'
import App from '@/App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import store from '@/store/index'
import routes from '@/router/routes'
import axiosPlugin from '@/utils/axios'
import baseUrl from '@/api/base'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import _ from 'lodash'

Vue.use(ElementUI)
Vue.use(VueRouter)

const router = new VueRouter({
  // mode: 'history', // 使用 history 模式
  routes
})

// 全局路由中间件，权限设置，to: 即将要进入的目标路由，from: 当前导航正要离开的路由，执行效果依赖 next
router.beforeEach((to, from, next) => {
  NProgress.start()

  store.dispatch('GenerateRouters').then((res) => {
    let authList = res.authUrl
    let url = to.path

    if (_.indexOf(authList, url) !== -1) {
      next()
    } else {
      next({
        path: '/404'
      })
    }
  }).catch(() => {
    // 请求失败跳至登陆页
  })
})

router.afterEach(() => {
  NProgress.done()
})

new Vue({
  axiosPlugin,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
