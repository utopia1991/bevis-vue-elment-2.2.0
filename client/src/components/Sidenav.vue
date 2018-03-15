<style scoped lang="scss">
  @import "../assets/scss/Layout.scss";
</style>

<template>
  <section class="side-nav">
    <section class="nav-users">
      <el-button type="primary" class="users-select" @click='usersSelect'>
        当前客户：{{userName}}
        <i class="el-icon-refresh el-icon--right"></i>  
      </el-button>
    </section>
    <!--菜单列-->
    <section v-for="(route, index) in routes" :key="index" class="nav-list">
      <!-- 无子菜单情况 -->
      <router-link v-if="route.children.length === 0 || route.collapse === true" :to="route.url" class="nav-items">
        <i :class="route.code"></i> {{route.cnName}}
      </router-link>
      <!-- 有子菜单情况 -->
      <el-submenu v-else :index="route.url">
        <!-- 多级菜单标题 -->
        <section slot="title">
          <i :class="route.code"></i> {{route.cnName}}
        </section>
        <!-- 多级菜单子元素 -->
        <section v-for="(child, index) in route.children" :key="index">
          <router-link :to="child.url" class="subnav-items">
            {{child.cnName}}
          </router-link>
        </section>
      </el-submenu>
    </section>
    <!--选择客户弹窗-->
    <el-dialog title="选择客户" :visible.sync="usersFormVisible">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <span class="search-label">客户名称/英文名称：</span>
          <el-input v-model="filters.name" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="search-label">VIP等级：</span>
          <el-select v-model="filters.vip" filterable>
            <el-option 
              v-for="item in vipItems"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getCustomersList">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="customersRecord" stripe border v-loading="usersLoading" element-loading-text='加载中...' style="max-height: 460px; overflow-y: scroll;">
        <el-table-column prop="cnName" label="客户名称" sortable align="center">
        </el-table-column>
        <el-table-column prop="enName" label="英文名称" sortable align="center">
        </el-table-column>
        <el-table-column prop="company" label="所属分公司" sortable align="center">
        </el-table-column>
        <el-table-column prop="vip" label="VIP等级" sortable :formatter='formatVIP' align="center">
        </el-table-column>
        <el-table-column label="选择" align="center">
          <template slot-scope='scope'>
          <el-button size='small' type="primary" @click="customerSubmit(scope.row)">
            选择
          </el-button>
        </template>
        </el-table-column>
      </el-table>
      <br>
      <!--分页控件-->
      <el-col :span='24' class="pagination">
        <el-pagination
          @size-change='handleSizeChange'
          @current-change='handleCurrentChange'
          :current-page='cusPagination.currentPage'
          :page-sizes='[10, 20, 30, 40]'
          :page-size='cusPagination.limit'
          :total='cusPagination.total'
          layout='total, sizes, prev, pager, next, jumper'
          style='float:right;'>
        </el-pagination>
      </el-col>
      <div class="clearfix"></div>
    </el-dialog>
  </section>
</template>

<script>
  import getCustomers from '@/api/getCustomers'

  export default {
    data () {
      return {
        customersRecord: [],
        filters: {
          name: '',
          vip: 'all'
        },
        vipItems: [{
          value: 'all',
          label: '全部'
        }, {
          value: 'null',
          label: '无'
        }, {
          value: '1',
          label: '一星'
        }, {
          value: '2',
          label: '二星'
        }, {
          value: '3',
          label: '三星'
        }],
        // 分页控件
        cusPagination: {
          limit: 10, // 分页每页多少条
          start: 0,
          currentPage: 1,
          total: 0
        },
        // 客户切换弹窗
        usersFormVisible: false,
        usersLoading: false,
        usersForm: {
          name: '',
          vip: 'all'
        }
      }
    },
    // 子模块，props父模块注入值
    props: {
      routes: {
        type: Array
      },
      userName: String
    },
    methods: {
      // vip 转化
      formatVIP: function (row) {
        let vip = {
          'all': '全部',
          '1': '一星',
          '2': '二星',
          '3': '三星',
          'null': '无'
        }
        return vip[row.vip]
      },
      // 用户选择弹窗
      usersSelect: function () {
        this.usersFormVisible = true
        this.getCustomersList()
      },
      // 获取搜索记录
      getCustomersList: function () {
        this.usersLoading = true
        let params = {
          'name': this.filters.name,
          'vip': this.filters.vip
        }

        getCustomers.getCustomersList(params).then((res) => {
          this.usersLoading = false

          if (res.data.success === true) {
            this.cusPagination.total = res.data.value.totalCount
            this.customersRecord = res.data.value.rows
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      },
      // 用户选择分页条目
      handleSizeChange: function (val) {
        this.cusPagination.limit = val
        this.getCustomersList(this.cusPagination.start, this.cusPagination.limit)
      },
      // 用户选择分页切换页面
      handleCurrentChange: function (val) {
        this.cusPagination.start = (val - 1) * this.cusPagination.limit
        this.getCustomersList(this.cusPagination.start, this.cusPagination.limit)
      },
      customerSubmit: function (row) {
        let id = row.id

        getCustomers.customersSelect(id).then((res) => {
          this.usersLoading = false

          this.$confirm('确认选择当前客户?', '提示', {
            type: 'warning',
            cancelButtonClass: 'btn-cancel-right'
          }).then(() => {
            this.usersLoading = true
            let id = row.id

            if (res.data.success === true) {
              this.$message({
                message: '切换用户成功',
                type: 'success'
              })
              this.usersFormVisible = false
              this.getCustomersList()
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
