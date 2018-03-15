<style scoped lang="scss">
  @import "../assets/scss/Layout.scss";
</style>

<template>
  <el-col :span="24" class="header">
    <el-col :span="4" class="logo logo-width"></el-col>
    <el-col :span="20" class="userinfo">
      <nav class="menu-nav">
        <section v-for="(route, index) in routes" :key="index">
          <router-link :to="route.url" class="menu-items" v-if='route.children.length > 0'>
            {{route.cnName}}
          </router-link>
        </section>
      </nav>
      <span class="el-dropdown-link userinfo-inner username">
        {{userName}}
      </span>
      <el-tooltip class="item" effect="dark" content="退出登录" placement="bottom-end">
        <span @click="logout" class="logout">
          <i class="icon-logout"></i> 退出
        </span>
      </el-tooltip>
    </el-col>
  </el-col>
</template>

<script>
  export default {
    props: {
      routes: {
        type: Array
      },
      userName: String
    },
    data () {
      return {
      }
    },
    methods: {
      // 退出登录
      logout: function () {
        let _this = this

        this.$confirm('确认退出吗?', '提示', {
          type: 'warning',
          cancelButtonClass: 'btn-cancel-right'
        }).then(() => {
          localStorage.removeItem('user')
          _this.$router.push('/login')
        }).catch((err) => {
          console.log('错误：', err)
        })
      }
    }
  }
</script>
