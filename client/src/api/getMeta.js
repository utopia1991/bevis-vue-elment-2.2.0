import axios from 'axios'
import baseUrl from '@/api/base'

// 获取菜单权限和用户信息
export const getMeta = () => {
  return axios.get(`${baseUrl}/meta`).then(res => {
    let data = {}
    let authUrl = ['/404']
    let menu = res.data.value.menu
    let displayName = res.data.value.displayName
    let func = res.data.value.func

    // 插入一级页面 url
    menu.forEach(e => {
      authUrl.push(e.url)

      // 插入二级页面 url
      e.children.forEach(ev => {
        authUrl.push(ev.url)
      })
    })

    // 插入按钮页面
    for (let i in func) {
      func[i].forEach(e => {
        authUrl.push(i + '/' + e)
      })
    }

    data['menu'] = menu
    data['displayName'] = displayName
    data['authUrl'] = authUrl
    data['func'] = res.data.value.func
    return data
  }).catch(err => {
    console.log('请求失败: ', err)
    return err
  })
}
