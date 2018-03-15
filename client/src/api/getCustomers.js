import axios from 'axios'
import baseUrl from '@/api/base'

const getCustomers = {
  // 获取部署记录
  getCustomersList: params => {
    return axios({
      method: 'post',
      url: `${baseUrl}/getCustomersList`,
      params: params
    }).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },
  // 获取部署记录
  customersSelect: id => {
    return axios({
      method: 'post',
      url: `${baseUrl}/customersSelect`,
      params: id
    }).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  }
}

export default getCustomers
