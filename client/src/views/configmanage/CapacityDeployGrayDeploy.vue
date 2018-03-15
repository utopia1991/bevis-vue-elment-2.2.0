<style lang="scss" scoped>
  @import "../../assets/scss/List";

  .box {
    .left-table {
      width: 48%;
      margin-right:2%;
      float:left;
    }
    .right-table{
      width: 48%;
      float: left;
    }
    .right-table, .left-table {
      .inner-table {
        height: 500px;
        overflow-y: scroll;
        border-bottom: 1px solid #ebeef5;
      }
    }
    .deploy-button {
      width: 120px;
      margin-right: 30px;
      margin-top: -20px;
    }
    .table-label {
      height: 40px;
      line-height: 40px;
    }
  }
</style>

<template>
  <section class='box'>
    <p style="margin-top: 0px;">
      <router-link :to="{path: from}">
        <el-button type="primary" icon="el-icon-arrow-left">上一页</el-button>
      </router-link>
    </p>
    <!--搜索条-->
    <el-col :span="24" class="search">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <span class="search-label">逻辑组：</span>
          <el-input v-model="filters.logicGroup"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="search-label">集群：</span>
          <el-input v-model="filters.colony"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getLogicGroup">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--左列表内容-->
    <section class="left-table">
      <p class="table-label">可选逻辑组</p>
      <el-table class="inner-table" :data="datas" stripe border v-loading="loading" element-loading-text='加载中...' @selection-change='selsChange' ref="multipleTable">
        <el-table-column type='selection' align="center">
        </el-table-column>
        <el-table-column prop="logicGroup" label="逻辑组" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="vmp" label="VMP集群" sortable show-overflow-tooltip>
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
    </section>
    <!--右列表内容-->
    <section class="right-table">
      <p class="table-label">
        已选逻辑组
        <el-button type="danger" icon="el-icon-delete" @click="removeAllLogicGroup" style="float:right;">删除所有已选逻辑组</el-button>
      </p>
      <el-table class="inner-table" :data="selectedDatas" stripe border>
        <el-table-column label='操作' width="120" align="center">
          <template slot-scope='scope'>
            <el-button type='danger' size='small' icon="el-icon-delete" @click='removeLogicGroup(scope.$index, scope.row)'></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="logicGroup" label="逻辑组" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="vmp" label="VMP集群" sortable show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </section>
    <div class="clearfix"></div>
    <p style="text-align: right;">
      <el-button type="primary" class="deploy-button">部署</el-button>
    </p>
  </section>
</template>

<script>
  import capacityDeploy from '@/api/capacityDeploy'
  import moment from 'moment'
  import _ from 'lodash'

  export default {
    data () {
      return {
        from: this.$route.query.from,
        extend: false,
        sels: [], // 列表选中列
        loading: false,
        datas: [],
        selectedDatas: [],
        filters: {
          logicGroup: '',
          colony: ''
        },
        // 分页控件
        pagination: {
          limit: 10, // 分页每页多少条
          start: 0,
          currentPage: 1,
          total: 0
        },
        dialogFormVisible: false
      }
    },
    mounted () {
      // 页面挂载结束请求用户列表
      this.getLogicGroup()
    },
    methods: {
      // 分页条目
      handleSizeChange: function (val) {
        this.pagination.limit = val
        this.getLogicGroup(this.pagination.start, this.pagination.limit)
      },
      // 分页切换页面
      handleCurrentChange: function (val) {
        this.pagination.start = (val - 1) * this.pagination.limit
        this.getLogicGroup(this.pagination.start, this.pagination.limit)
      },
      // 列表多选
      selsChange: function (val) {
        this.selectedDatas = val
      },
      // 获取以及搜索用户
      getLogicGroup: function () {
        this.loading = true
        let params = {
          'name': this.filters.logicGroup,
          'email': this.filters.colony,
          'limit': this.pagination.limit,
          'start': this.pagination.start
        }

        capacityDeploy.getLogicGroup(params).then((res) => {
          this.loading = false

          if (res.data.success === true) {
            this.pagination.total = res.data.value.totalCount
            this.datas = res.data.value.rows
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      },
      // 删除单个逻辑组
      removeLogicGroup: function (index, row) {
        let id = row.id

        this.selectedDatas = _.filter(this.selectedDatas, function (n) {
          return n.id !== id
        })
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      // 删除所有选中逻辑组
      removeAllLogicGroup: function (index, row) {
        this.selectedDatas = []
        this.$refs.multipleTable.clearSelection()
      }
    }
  }
</script>
