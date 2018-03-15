 <style lang="scss" scoped="">
  @import "../../assets/scss/List";

  .search-input {
    width: 80%;
  }
  .cluster-input {
    width: 21%;
  }

  .box .search {
    .el-form-item {
      margin: 0 0 20px 0;

      .search-label {
        margin: 0;
      }

      .el-input {
        width: 63%;
      }
    }
  }

  .table-group {
    height: 500px;
    overflow-y: scroll;
  }
</style> 

<template> 
  <section class="box"> 
    <p style="margin-top: 0px;">
      <router-link :to="{path:from}"> 
        <el-button type="primary" icon="el-icon-arrow-left">
          上一页
        </el-button> 
      </router-link> 
    </p> 
    <!--左侧搜索条和表格数据--> 
    <el-col :span="8"> 
      <el-form :inline="true" :model="logicfilters" class="search"> 
        <el-form-item> 
          <span class="search-label">逻辑组:</span> 
          <el-input v-model="logicfilters.logicGroupName" class="search-input"></el-input> 
        </el-form-item> 
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="logicGroup">查询</el-button> 
        </el-form-item>
      </el-form> 
      <el-col :span="24" class="table-group"> 
        <el-table :data="logicData" stripe border v-loading="loading" element-loading-text="加载中..."> 
          <el-table-column width="34"> 
            <template slot-scope="scope"> 
            <el-radio v-model="logicRadio" :label="scope.$index+1" @change="handleLogicSelect(scope.row)"></el-radio> 
            </template> 
          </el-table-column> 
          <el-table-column prop="logicGroupName" label="逻辑组"> 
          </el-table-column> 
          <el-table-column prop="ip" label="IP地址"> 
          </el-table-column> 
        </el-table> 
      </el-col> 
      <el-col :span='24' class="pagination">
      <el-pagination @size-change="handleLogicSizeChange"
        @current-change="handleLogicCurrentChange" 
        :current-page="logicPagination.currentPage"
        :page-size="logicPagination.limit"
        :total="logicPagination.total"
        layout="total, prev, pager, next, jumper"
        style="float:right;"> 
      </el-pagination> 
      </el-col>
    </el-col> 
    <!--右侧搜索条和表格数据--> 
    <el-col :span="15" style="float:right;"> 
      <el-form :inline="true" :model="clusterfilters" class="search"> 
        <el-form-item class="cluster-input">
          <span class="search-label">集群名:</span> 
          <el-input v-model="clusterfilters.vmpClusterName"></el-input> 
        </el-form-item>
        <el-form-item class="cluster-input">
          <span class="search-label">省份:</span> 
          <el-input v-model="clusterfilters.province"></el-input> 
        </el-form-item>
        <el-form-item class="cluster-input">
          <span class="search-label">城市:</span> 
          <el-input v-model="clusterfilters.city"></el-input> 
        </el-form-item>
        <el-form-item class="cluster-input">
          <span class="search-label">区域:</span> 
          <el-input v-model="clusterfilters.region"></el-input> 
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="vmpCluster">查询</el-button> 
        </el-form-item>
      </el-form> 
      <el-col :span="24" class="table-group"> 
        <el-table :data="clusterData" stripe border v-loading="loading" element-loading-text="加载中..."> 
        <el-table-column width="34"> 
          <template slot-scope="scope"> 
          <el-radio v-model="matchRadio" :label="scope.$index+1" @change.native="handleClusterSelect(scope.row)"></el-radio> 
          </template> 
        </el-table-column> 
        <el-table-column prop="clusterId" label="集群标识"> 
        </el-table-column> 
        <el-table-column prop="name" label="集群名称"> 
        </el-table-column> 
        <el-table-column prop="province" label="省份"> 
        </el-table-column> 
        <el-table-column prop="city" label="城市"> 
        </el-table-column> 
        <el-table-column prop="region" label="区域"> 
        </el-table-column> 
        <el-table-column prop="detailAddr" label="地址"> 
        </el-table-column> 
        </el-table> 
      </el-col> 
      <el-col :span='24' class="pagination">
        <el-pagination @size-change="handleClusterSizeChange"
          @current-change="handleClusterCurrentChange" 
          :current-page="clusterPagination.currentPage"
          :page-size="clusterPagination.limit"
          :total="clusterPagination.total" 
          layout="total, prev, pager, next, jumper"
          style="float:right;"> 
        </el-pagination> 
      </el-col> 
    </el-col> 
    <el-col style="text-align:center;padding-bottom:20px;"> 
     <el-button type="primary" @click="addClusterLogicGroup">
       配对 
     </el-button> 
    </el-col> 
  </section> 
</template> 

<script>
  import clusterMatch from '@/api/clusterMatch'

  export default {
    data () {
      return {
        from: this.$route.query.from,
        logicRadio: '',
        logicData: [],
        clusterData: [],
        matchRadio: '',
        logicfilters: {},
        clusterfilters: {},
        loading: false,
        logicPagination: {
          limit: 10, // 分页每页多少条
          start: 0,
          currentPage: 1,
          total: 0
        },
        clusterPagination: {
          limit: 10, // 分页每页多少条
          start: 0,
          currentPage: 1,
          total: 0
        },
        group: {}
      }
    },
    mounted () {
      // 页面挂载结束请求用户列表
      this.logicGroup()
      this.vmpCluster()
    },
    methods: {
      // 逻辑组分页条目
      handleLogicSizeChange: function (val) {
        this.logicPagination.limit = val
        this.logicGroup(this.logicPagination.start, this.logicPagination.limit)
      },
      // 逻辑组分页切换页面
      handleLogicCurrentChange: function (val) {
        this.logicPagination.start = (val - 1) * this.logicPagination.limit
        this.logicGroup(this.logicPagination.start, this.logicPagination.limit)
      },
      // 集群分页条目
      handleClusterSizeChange: function (val) {
        this.clusterPagination.limit = val
        this.logicGroup(this.clusterPagination.start, this.clusterPagination.limit)
      },
      // 集群分页切换页面
      handleClusterCurrentChange: function (val) {
        this.clusterPagination.start = (val - 1) * this.clusterPagination.limit
        this.logicGroup(this.clusterPagination.start, this.clusterPagination.limit)
      },
      // 逻辑组查询请求
      logicGroup: function () {
        var self = this
        this.loading = true
        let params = {
          limit: this.logicPagination.limit,
          start: this.logicPagination.start,
          logicGroupName: this.logicfilters.logicGroupName
        }

        clusterMatch.logicGroup(params).then((res) => {
          this.loading = false
          if (res.data.success === true) {
            this.logicPagination.total = res.data.value.total
            this.logicData = res.data.value.rows
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      },
      // vmp集群查询请求
      vmpCluster: function () {
        var self = this
        this.loading = true
        let params = {
          limit: this.clusterPagination.limit,
          start: this.clusterPagination.start,
          vmpClusterName: this.clusterfilters.vmpClusterName,
          region: this.clusterfilters.region,
          province: this.clusterfilters.province,
          city: this.clusterfilters.city
        }

        clusterMatch.vmpCluster(params).then((res) => {
          this.loading = false
          if (res.data.success === true) {
            this.clusterPagination.total = res.data.value.total
            this.clusterData = res.data.value.rows
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      },
      handleLogicSelect: function (row) {
        this.group['logicGroupId'] = row.logicGroupId
      },
      handleClusterSelect: function (row) {
        this.group['clusterId'] = row.clusterId
      },
      addClusterLogicGroup: function () {
        this.$confirm('确认该集群配对吗?', '提示', {
          type: 'warning',
          cancelButtonClass: 'btn-cancel-right'
        }).then(() => {
          this.loading = true
          let self = this
          let params = this.group

          clusterMatch.addClusterLogicGroup(params).then((res) => {
            this.loading = false
            if (res.data.success === true) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        })
      }
    }
  }
</script> 