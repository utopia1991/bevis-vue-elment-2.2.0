<style lang="scss" scoped>
  @import "../../assets/scss/List";

  .deploy-range {
    .el-table::before {
      height: 0;
    }
  }
</style>

<template>
  <section class='box'>
    <!--搜索条-->
    <el-col :span="24" class="search">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <span class="search-label">应用名：</span>
          <el-input v-model="filters.app"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="search-label">软件包名：</span>
          <el-input v-model="filters.software"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="search-label">状态：</span>
          <el-select v-model="filters.status" filterable>
            <el-option
              v-for="item in statusItems"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span class="search-label">部署时间：</span>
          <el-date-picker
            v-model="filters.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getAbilityDeploy">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <section class="tools">
      <el-button type="primary" icon="el-icon-plus" v-on:click="handleAdd">新增</el-button>
    </section>
    <!--列表内容-->
    <el-table class="ec-table" :data="abilityDeployRecord" stripe border v-loading="loading" element-loading-text='加载中...'>
      <el-table-column prop="deployTime" label="部署时间" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="app" label="应用名" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="software" label="软件包" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="canUpdateTime" label="允许升级时间" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deployRange" label="部署范围" sortable show-overflow-tooltip>
        <template slot-scope='scope'>
          {{scope.row.deployRange}}
          (<span class="link-type" @click="deployRangeDetail(scope.row)">
            {{scope.row.deployRangeCount}}
          </span>)
        </template>
      </el-table-column>      
      <el-table-column prop="status" label="状态" sortable show-overflow-tooltip :formatter='formatStatus'>
      </el-table-column>
      <el-table-column label='操作' align="center">
        <template slot-scope='scope'>
          <el-tooltip class="item" effect="dark" content="作废" placement="top">
            <el-button type='danger' @click='removeRecord(scope.$index, scope.row)' icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页控件-->
    <el-col :span='24' class="pagination">
      <el-pagination
        @size-change='handleSizeChange'
        @current-change='handleCurrentChange'
        :current-page='pagination.currentPage'
        :page-sizes='[10, 20, 30, 40]'
        :page-size='pagination.limit'
        :total='pagination.total'
        layout='total, sizes, prev, pager, next, jumper'
        style='float:right;'>
      </el-pagination>
    </el-col>
    <!--新增部署弹窗-->
    <el-dialog title='新增部署' :visible.sync='addFormVisible' :close-on-click-modal='false' width="42%">
      <el-form :model='addForm' label-width='120px' ref='addForm'>
        <el-form-item label='应用名：'>
          <el-select v-model="addForm.app" filterable placeholder="请选择应用名">
            <el-option
              v-for="item in appItems"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='软件包：'>
          <el-select v-model="addForm.software" filterable placeholder="请选择软件包">
            <el-option
              v-for="item in softwareItems"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='允许升级时间：'>
          <el-date-picker v-model="addForm.updateTimeRange" 
            type="datetimerange"
            placeholder="选择时间范围"
            align="right" 
            class="date-picker">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <p style="text-align: center;">
        <el-button type='primary' style="margin-right: 15px;">
          正式发布（全部逻辑组）
        </el-button>
        <router-link v-show="buttonAuth.graydeploy" :to="{ path:'/configmanage/capacity-deploy/graydeploy', query: { app: addForm.app, software: addForm.software, from: fromPath }}">
          <el-button>
            灰度发布（挑选逻辑组）
          </el-button>
        </router-link>
      </p>
    </el-dialog>
    <!--查询部署范围弹窗-->
    <el-dialog title="部署范围（软件包名）" :visible.sync="deployFormVisible" class="deploy-range" width="54%">
      <el-form :inline="true" :model="rangeFilters">
        <el-form-item>
          <span class="search-label">逻辑组：</span>
          <el-input v-model="rangeFilters.app" style="width:240px;"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="search-label">状态：</span>
          <el-select v-model="rangeFilters.status" filterable>
            <el-option 
              v-for="item in rangeStatusItems"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getDeployRange">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="deployRangeRecord" stripe border v-loading="loading" element-loading-text='加载中...' style="overflow-y: scroll;max-height: 440px;">
        <el-table-column prop="logicGroup" label="逻辑组" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="status" label="状态名称" sortable show-overflow-tooltip :formatter='formatRangeStatus'>
        </el-table-column>
      </el-table>
      <!--分页控件-->
      <el-col :span='24' class="pagination">
        <!-- size-change 事件处理页码大小变动时候触发的事件 -->
        <!-- current-change 事件处理当前页变动时候触发的事件 -->
        <el-pagination
          @size-change='handleRangeSizeChange'
          @current-change='handleRangeCurrentChange'
          :current-page='rangePagination.currentPage'
          :page-sizes='[10, 20, 30, 40]'
          :page-size='rangePagination.limit'
          :total='rangePagination.total'
          layout='total, sizes, prev, pager, next, jumper'
          style='float:right;'>
        </el-pagination>
      </el-col>
      <div class="clearfix"></div>
    </el-dialog>
  </section>
</template>

<script>
  import capacityDeploy from '@/api/capacityDeploy'
  import moment from 'moment'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data () {
      return {
        fromPath: this.$route.path,
        extend: false,
        loading: false,
        abilityDeployRecord: [],
        deployRangeRecord: [],
        filters: {
          app: '',
          software: '',
          status: 'all',
          timeRange: ''
        },
        rangeFilters: {
          app: '',
          status: 'all'
        },
        statusItems: [{
          value: 'all',
          label: '全部'
        }, {
          value: 'effected',
          label: '生效'
        }, {
          value: 'cancel',
          label: '作废'
        }],
        rangeStatusItems: [{
          value: 'all',
          label: '全部'
        }, {
          value: 'deployed',
          label: '已部署'
        }, {
          value: 'noDepoly',
          label: '未部署'
        }],
        // 应用名后台请求回来
        appItems: [{
          value: 'all',
          label: '全部'
        }],
        // 软件名根据应用名级联由后台请求回来
        softwareItems: [{
          value: 'all',
          label: '全部'
        }],
        // 分页控件
        pagination: {
          limit: 10, // 分页每页多少条
          start: 0,
          currentPage: 1,
          total: 0
        },
        // 分页控件
        rangePagination: {
          limit: 10, // 分页每页多少条
          start: 0,
          currentPage: 1,
          total: 0
        },
        // 新增弹窗
        addFormVisible: false,
        addLoading: false,
        addForm: {
          app: '',
          software: '',
          updateTimeRange: ''
        },
        deployFormVisible: false,
        // 按钮权限
        buttonAuth: {}
      }
    },
    computed: {
      ...mapGetters([
        'func'
      ])
    },
    mounted () {
      // 页面挂载结束请求用户列表
      this.getAbilityDeploy()
      this.getButtonAuth()
    },
    methods: {
      getButtonAuth: function () {
        let but = this.func[this.$route.path]

        but.forEach(e => {
          this.buttonAuth[e] = true
        })
      },
      // 能力部署表格状态转换
      formatStatus: function (row) {
        let state = {
          'all': '全部',
          'effected': '生效',
          'cancel': '作废'
        }
        return state[row.status]
      },
      // 部署范围表格状态转换
      formatRangeStatus: function (row) {
        let state = {
          'deployed': '已部署',
          'noDepoly': '未部署'
        }
        return state[row.status]
      },
      // 能力部署分页条目
      handleSizeChange: function (val) {
        this.pagination.limit = val
        this.getAbilityDeploy(this.pagination.start, this.pagination.limit)
      },
      // 能力部署分页切换页面
      handleCurrentChange: function (val) {
        this.pagination.start = (val - 1) * this.pagination.limit
        this.getAbilityDeploy(this.pagination.start, this.pagination.limit)
      },
      // 部署范围分页条目
      handleRangeSizeChange: function (val) {
        this.rangePagination.limit = val
        this.getDeployRange(this.rangePagination.start, this.rangePagination.limit)
      },
      // 部署范围分页切换页面
      handleRangeCurrentChange: function (val) {
        this.rangePagination.start = (val - 1) * this.rangePagination.limit
        this.getDeployRange(this.rangePagination.start, this.rangePagination.limit)
      },
      // 获取搜索记录
      getAbilityDeploy: function () {
        this.loading = true
        let params = {
          'app': this.filters.app,
          'software': this.filters.software,
          'status': this.filters.status,
          'timeRange': this.filters.timeRange,
          'limit': this.pagination.limit,
          'start': this.pagination.start
        }

        capacityDeploy.getAbilityDeploy(params).then((res) => {
          this.loading = false

          if (res.data.success === true) {
            this.pagination.total = res.data.value.totalCount
            this.abilityDeployRecord = res.data.value.rows
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      },
      // 作废单个部署记录
      removeRecord: function (index, row) {
        this.$confirm('确认作废该条部署记录吗?', '提示', {
          type: 'warning',
          cancelButtonClass: 'btn-cancel-right'
        }).then(() => {
          this.listLoading = true
          let id = row.id

          capacityDeploy.removeDeployRecord(id).then((res) => {
            this.listLoading = false

            if (res.data.success === true) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.getAbilityDeploy()
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        })
      },
      // 获取部署范围记录
      getDeployRange: function (index, row) {
        this.loading = true
        let params = {
          'app': this.rangeFilters.app,
          'status': this.rangeFilters.status,
          'limit': this.rangePagination.limit,
          'start': this.rangePagination.start
        }

        capacityDeploy.getDeployRangeList(params).then((res) => {
          this.loading = false

          if (res.data.success === true) {
            this.rangePagination.total = res.data.value.totalCount
            this.deployRangeRecord = res.data.value.rows
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      },
      // 新增弹窗
      handleAdd: function (index, row) {
        this.addFormVisible = true
        this.addForm = {
          app: '',
          software: ''
        }
      },
      // 查看部署范围弹窗
      deployRangeDetail: function (index, row) {
        this.deployFormVisible = true
        this.getDeployRange()
      }
    }
  }
</script>
