import axios from 'axios'
import baseUrl from '@/api/base'

const applicationDeploy = {
  // 获取应用记录
  getApps: params => {
    return axios({
      method: 'get',
      url: `${baseUrl}/getApps`,
      params: params
    }).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },
  // 增加应用
  addApp: params => {
    return axios({
      method: 'get',
      url: `${baseUrl}/applicationDeploy/addApp`,
      params: params
    }).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },
  // 删除应用
  removeApp: params => {
    return axios.delete(`${baseUrl}/applicationDeploy/removeApp/${params}`).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },
  // 升级应用
  upgradeApp: params => {
    return axios({
      method: 'post',
      url: `${baseUrl}/applicationDeploy/upgradeApp`,
      params: params
    }).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },
  // 修改应用
  editApp: params => {
    return axios({
      method: 'post',
      url: `${baseUrl}/applicationDeploy/editApp`,
      params: params
    }).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },
  // 获取依赖配置信息
  getDependConfig: params => {
    return axios({
      method: 'post',
      url: `${baseUrl}/applicationDeploy/getDependConfig`,
      params: params
    }).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },
  // 应用依赖配置提交
  dependConfigSubmit: params => {
    return axios({
      method: 'post',
      url: `${baseUrl}/applicationDeploy/dependConfigSubmit`,
      params: params
    }).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  }
}

export default applicationDeploy
