import axios from 'axios'
import baseUrl from '@/api/base'

const logicDataList = {
  // 集群配对查询
  clusterLogicGroup: params => {
    return axios({
      method: 'get',
      url: `${baseUrl}/configmanage/cluster-match/clusterLogicGroup`,
      params: params
    }).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },

  // 新增集群配对
  addClusterLogicGroup: params => {
    return axios({
      method: 'post',
      url: `${baseUrl}/configmanage/cluster-match/clusterLogicGroup`,
      params: params
    }).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },

  // 逻辑组查询
  logicGroup: params => {
    return axios({
      method: 'get',
      url: `${baseUrl}/configmanage/cluster-match/logicGroup`,
      params: params
    }).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },

  // VMP集群查询
  vmpCluster: params => {
    return axios({
      method: 'get',
      url: `${baseUrl}/configmanage/cluster-match/vmpCluster`,
      params: params
    }).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },

  deleteLogicCluster: params => {
    return axios.delete(`${baseUrl}/configmanage/cluster-match/clusterLogicGroup/${params}`).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  }
}
export default logicDataList
