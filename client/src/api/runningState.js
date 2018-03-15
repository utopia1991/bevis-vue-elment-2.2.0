import axios from 'axios'
import baseUrl from '@/api/base'

const logicDataList = {
  getLogicData: params => {
    return axios({
      method: 'get',
      url: `${baseUrl}/logicData`,
      params: params
    }).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  }
}

export default logicDataList
