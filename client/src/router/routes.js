import NotFound from '@/views/404'
import Layout from '@/components/Layout'
// 边缘计算页面
import ClusterMatch from '@/views/configmanage/ClusterMatch'
import ClusterMatchAdd from '@/views/configmanage/ClusterMatchAdd'
import AppConfig from '@/views/configmanage/AppConfig'
import CapacityDeploy from '@/views/configmanage/CapacityDeploy'
import CapacityDeployGrayDeploy from '@/views/configmanage/CapacityDeployGrayDeploy'
import RunningState from '@/views/configmanage/RunningState'

// 配置路由
const routes = [
  { path: '/404', component: NotFound, name: '404', hidden: true },
  { path: '/', redirect: '/configmanage/cluster-match', hidden: true },
  {
    path: '/configmanage', component: Layout, redirect: '/configmanage/cluster-match', name: '配置管理',
    children: [
      { path: 'cluster-match', component: ClusterMatch, name: '集群配对' },
      { path: 'cluster-match/add', component: ClusterMatchAdd, name: '集群配对新增' },
      { path: 'app-config', component: AppConfig, name: '应用配置' },
      { path: 'capacity-deploy', component: CapacityDeploy, name: '能力部署' },
      { path: 'capacity-deploy/graydeploy', component: CapacityDeployGrayDeploy, name: '能力部署（软件包名）' },
      { path: 'running-state', component: RunningState, name: '服务运行状态' }
    ]
  },
  { path: '*', hidden: true, redirect: { path: '/404' } }
]

export default routes
