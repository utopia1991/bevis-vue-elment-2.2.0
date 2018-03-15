<style lang="scss" scoped>
  @import "../../assets/scss/List";
</style>

<template>
  <section class='box'>
    <!--搜索条-->
    <el-col :span="24" class="search">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <span class="search-label">逻辑组：</span>
          <el-input v-model="filters.logicName"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="search-label">运行状态：</span>
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
          <el-button type="primary" icon="el-icon-search" @click="getLogicData">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表内容-->
    <el-table class="ec-table" :data="logic_data" stripe border v-loading="loading" element-loading-text='加载中...'>
      <el-table-column prop="logicName" label="逻辑组" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="application" label="应用" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="software" label="软件包" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="vm" label="虚拟机" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="state" label="运行状态" sortable show-overflow-tooltip>
      </el-table-column>      
      <el-table-column prop="updateTime" label="更新时间" sortable show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <!--分页控件-->
    <el-col :span='24' class="pagination">
      <!-- size-change 事件处理页码大小变动时候触发的事件 -->
      <!-- current-change 事件处理当前页变动时候触发的事件 -->
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
  </section>
</template>

<script>
  import runningState from '@/api/runningState'
  import moment from 'moment'

  export default {
    data () {
      return {
        extend: false,
        sels: [], // 列表选中列
        loading: false,
        logic_data: [],
        temp: {
          name: '',
          email: '',
          status: '',
          process: ''
        },
        filters: {
          logicName: '',
          status: '0'
        },
        statusItems: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '构建中'
        }, {
          value: '2',
          label: '运行中'
        }, {
          value: '3',
          label: '安装中'
        }, {
          value: '4',
          label: '已安装'
        }, {
          value: '5',
          label: '正在服务'
        }, {
          value: '6',
          label: '无服务'
        }],
        // 分页控件
        pagination: {
          limit: 10, // 分页每页多少条
          start: 0,
          currentPage: 1,
          total: 0
        }
      }
    },
    mounted () {
      // 页面挂载结束请求用户列表
      this.getLogicData()
    },
    methods: {
      // 分页条目
      handleSizeChange: function (val) {
        this.pagination.limit = val
        this.getLogicData(this.pagination.start, this.pagination.limit)
      },
      // 分页切换页面
      handleCurrentChange: function (val) {
        this.pagination.start = (val - 1) * this.pagination.limit
        this.getLogicData(this.pagination.start, this.pagination.limit)
      },
      // 获取以及搜索用户
      getLogicData: function () {
        this.loading = true
        let params = {
          'logicName': this.filters.logicName,
          'status': this.filters.status,
          'limit': this.pagination.limit,
          'start': this.pagination.start
        }

        runningState.getLogicData(params).then((res) => {
          this.loading = false

          if (res.data.success === true) {
            this.pagination.total = res.data.value.totalCount
            this.logic_data = res.data.value.rows
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      }
    }
  }
</script>
