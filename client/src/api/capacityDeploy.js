import axios from 'axios'
import baseUrl from '@/api/base'

const abilityDeploy = {
  getLogicGroup: params => {
    return axios({
      method: 'get',
      url: `${baseUrl}/abilityDeploySoftware/getLogicGroup`,
      params: params
    }).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },

  // 获取部署记录
  getAbilityDeploy: params => {
    return axios({
      method: 'get',
      url: `${baseUrl}/abilityDeploy`,
      params: params
    }).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },

  // 获取部署范围记录
  getDeployRangeList: params => {
    return axios({
      method: 'get',
      url: `${baseUrl}/abilityDeployRangeList`,
      params: params
    }).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },

  // 作废部署记录
  removeDeployRecord: params => {
    return axios.delete(`${baseUrl}/abilityDeploy/remove/${params}`).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },

  // 添加部署记录
  addDeployRecord: params => {
    return axios.post(`${baseUrl}/abilityDeploy/add`, params).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },

  // 升级应用
  upgradeApp: params => {
    return axios.post(`${baseUrl}/abilityDeploy/upgrade`, params).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },

  // 修改应用
  editApp: params => {
    return axios.post(`${baseUrl}/abilityDeploy/edit`, params).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  }
}

export default abilityDeploy
