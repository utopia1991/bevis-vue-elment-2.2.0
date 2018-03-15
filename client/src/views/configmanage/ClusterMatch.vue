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
        <el-form-item >
          <span class="search-label">集群：</span>
          <el-input v-model="filters.colony"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" icon="el-icon-search" @click="clusterLogicGroup">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表内容-->
    <p style="margin-top: 0px;" v-show="buttonAuth.add">
      <router-link :to="{path:'/configmanage/cluster-match/add', query: { from: fromPath }}">
        <el-button type="primary" icon="el-icon-plus">新增</el-button>
      </router-link>
    </p>
    <el-table class="ec-table" :data="logicData" stripe border v-loading="loading" element-loading-text='加载中...'>
      <el-table-column prop="logicGroupName" label="逻辑组" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="vmpClusterName" label="VMP集群" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column label='操作' align="center">
        <template slot-scope='scope'>
          <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <el-button icon="el-icon-view" @click='handleDetails(scope.$index, scope.row)'></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type='danger' icon="el-icon-delete" @click='deleteLogicCluster(scope.$index, scope.row)'></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 详细信息弹窗 -->
    <el-dialog title="详细信息" :visible.sync="dialogTableVisible">
      <el-table :data="detailLogicData" stripe border >
        <el-table-column prop="logicGroupName" label="逻辑组名"></el-table-column>
        <el-table-column prop="vmpClusterName" label="vmp集群"></el-table-column>
      </el-table>
    </el-dialog>
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
</template>

<script>
  // 将每个页面的所有api都放在一个api文件中去管理，@为 src 目录
  import clusterMatch from '@/api/clusterMatch'
  import moment from 'moment'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data () {
      return {
        fromPath: this.$route.path,
        dialogTableVisible: false,
        loading: false,
        detailLogicData: [],
        logicData: [],
        filters: {
          logicName: '',
          colony: ''
        },
        // 分页控件
        pagination: {
          limit: 10, // 分页每页多少条
          start: 0,
          currentPage: 1,
          total: 0
        },
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
      this.clusterLogicGroup()
      this.getButtonAuth()
    },
    methods: {
      getButtonAuth: function () {
        let but = this.func[this.$route.path] || []

        but.forEach(e => {
          this.buttonAuth[e] = true
        })
      },
      // 分页条目
      handleSizeChange: function (val) {
        this.pagination.limit = val
        this.clusterLogicGroup(this.pagination.start, this.pagination.limit)
      },
      // 分页切换页面
      handleCurrentChange: function (val) {
        this.pagination.start = (val - 1) * this.pagination.limit
        this.clusterLogicGroup(this.pagination.start, this.pagination.limit)
      },
      // 获取以及搜索用户
      clusterLogicGroup: function () {
        var self = this
        this.loading = true
        let params = {
          limit: this.pagination.limit,
          start: this.pagination.start,
          logicName: this.filters.logicName,
          colony: this.filters.colony
        }

        clusterMatch.clusterLogicGroup(params).then((res) => {
          this.loading = false

          if (res.data.success === true) {
            this.pagination.total = res.data.value.total
            this.logicData = res.data.value.rows
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      },
      // 删除单个逻辑组
      deleteLogicCluster: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning',
          cancelButtonClass: 'btn-cancel-right'
        }).then(() => {
          this.listLoading = true
          let id = row.relationId

          clusterMatch.deleteLogicCluster(id).then((res) => {
            this.listLoading = false
            if (res.data.success === true) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.clusterLogicGroup()
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        })
      },
      // 查看记录el-table表格:data 要用对象数组，返回的对应row为一个对象。
      handleDetails: function (index, row) {
        this.dialogTableVisible = true
        this.detailLogicData = []
        var tempArray = Object.assign([], row)
        this.detailLogicData.push(tempArray)
      }
    }
  }
</script>