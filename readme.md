## 边缘计算

### 客户端

技术栈：

``` bash
vue vuex vue-router element-ui
```

执行命令：

``` bash
# 安装
npm install

# 启动项目
npm run dev

# 编译项目
npm run build

# 编译项目并查看编译报告
npm run build --report
```

### 服务端

技术栈：

``` bash
koa2
```

执行命令：

``` bash
# 安装依赖
npm install

# 启动项目
npm start
```

### 注意事项：

- 服务端使用 node 作为模拟数据使用，应该先启动服务端，之后再启动客户端
- 本地开发将接口 /api 代理至本地，与后端联调时修改 client/config/index.js 下 /api 的代理即可
- 要想本地将 vue 打包文件 dist 跑起来，只要把 client/dist 下所有文件复制到 server/public 下，在启动 server 服务即可