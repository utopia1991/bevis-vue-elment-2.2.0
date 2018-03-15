<style lang="scss" scoped>
  @import "../../assets/scss/List";

  .operation-button {
    margin: 0;
  }
  .app-input {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
  }
  .dialog-footer {
    text-align: center;
  }
  .depend-form {
    max-height: 220px;
    overflow-y: auto;
  }
</style>

<template>
  <section class='box'>
    <!--新增应用-->
    <section class="tools">
      <el-button type="primary" icon="el-icon-plus" @click="handleAddApp" v-show="buttonAuth.add">新增应用</el-button>
    </section>
    <!--列表内容-->
    <section class="ec-table">
      <el-table :data="apps" stripe border v-loading="loading" element-loading-text='加载中...'>
        <el-table-column prop="app" label="应用名" sortable show-overflow-tooltip min-width="110">
        </el-table-column>
        <el-table-column prop="software" label="软件包名" sortable show-overflow-tooltip min-width="110">
        </el-table-column>
        <el-table-column prop="process" label="进程名" sortable show-overflow-tooltip min-width="110">
        </el-table-column>
        <el-table-column prop="port" label="端口" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="startCommand" label="启动命令" sortable show-overflow-tooltip min-width="110">
        </el-table-column>
        <el-table-column prop="stopCommand" label="停止命令" sortable show-overflow-tooltip min-width="110">
        </el-table-column>
        <el-table-column prop="status" label="状态" sortable show-overflow-tooltip :formatter='formatStatus'>
        </el-table-column>
        <el-table-column prop="template" label="模板" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="image" label="镜像" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column label='操作' min-width="210" align="center">
          <template slot-scope='scope'>
            <el-tooltip class="item" effect="dark" content="修改" placement="top" v-show="buttonAuth.edit">
              <el-button icon="el-icon-edit" @click='handleEditApp(scope.$index, scope.row)'></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="依赖配置" placement="top" v-show="buttonAuth.dependency">
              <el-button icon="el-icon-setting" @click='handleDependConfig(scope.row)'></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="应用升级" placement="top" v-show="buttonAuth.upgrade">
              <el-button icon="el-icon-upload2" @click='handleUpgradeApp'></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-show="buttonAuth.delete">
              <el-button icon="el-icon-delete" @click='removeApp(scope.$index, scope.row)' type='danger' style="margin-left: 10px;"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!--新增应用弹窗-->
    <el-dialog title='新增应用' :visible.sync='addFormVisible' :close-on-click-modal='false' width="40%">
      <el-form :model='addForm' label-width='100px' label-position='left' :rules='addFormRules' ref='addForm'>
        <el-form-item label='应用名：' class="app-input" prop="app">
          <el-input v-model='addForm.app'></el-input>
        </el-form-item>
        <el-form-item label='软件包：' class="app-input">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="submitPreview"
            :on-remove="submitRemove"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">仅支持rpm/gz包</div>
          </el-upload>
        </el-form-item>
        <el-form-item label='进程名：' class="app-input" prop="process">
          <el-input v-model='addForm.process'></el-input>
        </el-form-item>
        <el-form-item label='端口：' class="app-input" prop="port">
          <el-input v-model='addForm.port'></el-input>
        </el-form-item>
        <el-form-item label='启动命令：' class="app-input" prop="startCommand">
          <el-input v-model='addForm.startCommand'></el-input>
        </el-form-item>
        <el-form-item label='停止命令：' class="app-input" prop="stopCommand">
          <el-input v-model='addForm.stopCommand'></el-input>
        </el-form-item>
        <el-form-item label='状态：' class="app-input" prop="status">
          <el-select v-model="addForm.status" filterable placeholder="请选择状态">
            <el-option
              v-for="item in statusItems"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button type='primary' @click="addApp('addForm')" :loading='addLoading'>保存</el-button>
        <el-button @click.native='addFormVisible = false'>取消</el-button>
      </div>
    </el-dialog>
    <!--修改应用弹窗-->
    <el-dialog title='修改应用' :visible.sync='editFormVisible' :close-on-click-modal='false' width="40%">
      <el-form :model='editForm' label-width='100px' label-position='left' :rules='addFormRules' ref='editForm'>
        <el-form-item label='应用名：' class="app-input" prop="app">
          <el-input v-model='editForm.app'></el-input>
        </el-form-item>
        <el-form-item label='进程名：' class="app-input" prop="process">
          <el-input v-model='editForm.process'></el-input>
        </el-form-item>
        <el-form-item label='端口：' class="app-input" prop="port">
          <el-input v-model='editForm.port'></el-input>
        </el-form-item>
        <el-form-item label='启动命令：' class="app-input" prop="startCommand">
          <el-input v-model='editForm.startCommand'></el-input>
        </el-form-item>
        <el-form-item label='停止命令：' class="app-input" prop="stopCommand">
          <el-input v-model='editForm.stopCommand'></el-input>
        </el-form-item>
        <el-form-item label='状态：' class="app-input" prop="status">
          <el-select v-model="editForm.status" filterable placeholder="请选择状态">
            <el-option
              v-for="item in statusItems"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button type='primary' @click="editApp('editForm')" :loading='editLoading'>保存</el-button>
        <el-button @click.native='editFormVisible = false'>取消</el-button>
      </div>
    </el-dialog>
    <!--依赖配置弹窗-->
    <el-dialog title='应用依赖配置（应用名）' :visible.sync='dependFormVisible' :close-on-click-modal='false' width="84%">
      <p style="margin-top: -20px;">虚拟机模拟选择</p>
      <section class="depend-form">
        <el-table :data="vmData" stripe border v-loading="loading" element-loading-text='加载中...'>
          <el-table-column width="34" align="center">
            <template slot-scope="scope">
              <el-radio v-model="vmRadio" :label="scope.$index+1" @change.native="handleVmSelect(scope.row)"></el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="模板名称" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="cpu" label="cpu数量" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="memory" label="内存大小" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="disk" label="磁盘信息" sortable show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </section>
      <p>镜像选择</p>
      <section class="depend-form">
        <el-table :data="imageData" stripe border v-loading="loading" element-loading-text='加载中...'>
          <el-table-column width="34" align="center">
            <template slot-scope="scope">
              <el-radio v-model="imageRadio" :label="scope.$index+1" @change.native="handleImageSelect(scope.row)"></el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="镜像名称" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="type" label="镜像类型" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="format" label="镜像格式" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="diskMin" label="系统盘最小要求" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="imageMin" label="镜像最小要求" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="status" label="镜像状态" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="extend" label="扩展配置" sortable show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </section>
      <div slot='footer' class='dialog-footer'>
        <el-button type='primary' @click='dependConfigSubmit' :loading='dependLoading'>保存</el-button>
        <el-button @click.native='dependFormVisible = false'>取消</el-button>
      </div>
    </el-dialog>
    <!--应用升级弹窗-->
    <el-dialog title='应用升级' :visible.sync='upgradeFormVisible' :close-on-click-modal='false' width="40%">
      <el-form :model='upgradeForm' label-width='100px' label-position='left' ref='upgradeForm'>
        <el-form-item label='软件包：' class="app-input">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="submitPreview"
            :on-remove="submitRemove"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">仅支持rpm/gz包</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button type='primary' @click='upgradeApp' :loading='upgradeLoading'>保存</el-button>
        <el-button @click.native='upgradeFormVisible = false'>取消</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import appConfig from '@/api/appConfig'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data () {
      return {
        fromPath: this.$route.path,
        extend: false,
        loading: false,
        apps: [],
        statusItems: [{
          value: 1,
          label: '有效'
        }, {
          value: 0,
          label: '失效'
        }],
        // 新增应用弹窗
        addFormVisible: false, // 新增界面是否显示
        addLoading: false,
        addForm: {
          app: '',
          software: '',
          process: '',
          port: '',
          startCommand: '',
          stopCommand: '',
          status: ''
        },
        addFormRules: {
          app: [{ required: true, message: '请输入应用名', trigger: 'blur,change' }],
          process: [{ required: true, message: '请输入进程名', trigger: 'blur,change' }],
          port: [
            { required: true, message: '请输入端口', trigger: 'blur,change' }
          ],
          startCommand: [{ required: true, message: '请输入启动命令', trigger: 'blur,change' }],
          stopCommand: [{ required: true, message: '请输入停止命令', trigger: 'blur,change' }],
          status: [{ required: true, message: '请输入状态', trigger: 'blur,change' }]
        },
        fileList: [],
        // 升级应用弹窗
        upgradeFormVisible: false,
        upgradeLoading: false,
        upgradeForm: {},
        // 修改应用弹窗
        editFormVisible: false,
        editLoading: false,
        editForm: {},
        // 依赖配置弹窗
        dependFormVisible: false,
        dependLoading: false,
        vmData: [],
        imageData: [],
        vmRadio: '',
        imageRadio: '',
        dependSelect: {},
        buttonAuth: {}
      }
    },
    computed: {
      ...mapGetters([
        'func'
      ])
    },
    mounted () {
      this.getApps()
      this.getButtonAuth()
    },
    methods: {
      getButtonAuth: function () {
        let but = this.func[this.$route.path]

        but.forEach(e => {
          this.buttonAuth[e] = true
        })
      },
      // 状态转换
      formatStatus: function (row) {
        let status = {
          '0': '失效',
          '1': '有效'
        }
        return status[row.status]
      },
      // 列表多选
      selsChange: function (sels) {
        this.sels = sels
      },
      // 获取以及搜索用户
      getApps: function () {
        this.loading = true

        appConfig.getApps().then((res) => {
          this.loading = false

          if (res.data.success === true) {
            this.apps = res.data.value.rows
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      },
      // 修改应用
      editApp: function () {
        this.$refs.editForm.validate((valid) => {
          // 验证输入框信息合法
          if (valid) {
            this.$confirm('确认修改吗？', '提示', {
              cancelButtonClass: 'btn-cancel-right'
            }).then(() => {
              this.editLoading = true
              let params = Object.assign({}, this.editForm)

              appConfig.editApp(params).then((res) => {
                this.editLoading = false

                if (res.data.success === true) {
                  this.$message({
                    message: res.data.msg,
                    type: 'success'
                  })
                  this.editFormVisible = false
                  this.getApps()
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: 'error'
                  })
                }
              })
            })
          }
        })
      },
      // 新增应用保存
      addApp: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('确定新增应用吗？', '提示', {
              cancelButtonClass: 'btn-cancel-right'
            }).then(() => {
              this.addLoading = true
              let params = Object.assign({}, this.addForm)

              appConfig.addApp(params).then((res) => {
                this.addLoading = false
                this.$message({
                  message: '新增应用成功',
                  type: 'success'
                })
                this.$refs['addForm'].resetFields()
                this.addFormVisible = false
                this.getApps()
              })
            })
          }
        })
      },
      // 应用升级保存
      upgradeApp: function () {
        this.$confirm('确定升级应用吗？', '提示', {
          cancelButtonClass: 'btn-cancel-right'
        }).then(() => {
          this.upgradeLoading = true
          let params = Object.assign({}, this.upgradeForm)

          appConfig.upgradeApp(params).then((res) => {
            this.upgradeLoading = false
            this.$message({
              message: '新增应用成功',
              type: 'success'
            })
            this.$refs['upgradeForm'].resetFields()
            this.upgradeFormVisible = false
            this.getApps()
          })
        })
      },
      // 应用依赖配置保存
      dependConfigSubmit: function () {
        this.$confirm('确定其应用依赖配置选择？', '提示', {
          cancelButtonClass: 'btn-cancel-right'
        }).then(() => {
          this.dependLoading = true
          let params = this.dependSelect
          console.log(params)

          appConfig.dependConfigSubmit(params).then((res) => {
            this.dependLoading = false
            this.$message({
              message: '配置应用依赖成功',
              type: 'success'
            })
            this.dependFormVisible = false
            this.getApps()
          })
        })
      },
      // 虚拟机模拟选择
      handleVmSelect: function (row) {
        this.dependSelect['vm'] = row
      },
      // 镜像选择
      handleImageSelect: function (row) {
        this.dependSelect['image'] = row
      },
      // 删除单个应用
      removeApp: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning',
          cancelButtonClass: 'btn-cancel-right'
        }).then(() => {
          this.listLoading = true
          let id = row.id

          appConfig.removeApp(id).then((res) => {
            this.listLoading = false

            if (res.data.success === true) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.getApps()
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        })
      },
      // 新增应用弹窗
      handleAddApp: function (index, row) {
        this.addFormVisible = true
        this.addForm = {
          app: '',
          software: '',
          process: '',
          port: '',
          startCommand: '',
          stopCommand: '',
          status: ''
        }
      },
      // 依赖配置弹窗
      handleDependConfig: function (row) {
        this.dependFormVisible = true
        let id = row.id

        appConfig.getDependConfig(id).then((res) => {
          this.vmData = res.data.value.vmData
          this.imageData = res.data.value.imageData
        })
      },
      // 应用升级弹窗
      handleUpgradeApp: function (row) {
        this.upgradeFormVisible = true
      },
      // 修改应用弹窗
      handleEditApp: function (index, row) {
        this.editFormVisible = true
        this.editForm = Object.assign({}, row)
      },
      // 新增应用软件包上传
      submitUpload: function () {
        this.$refs.upload.submit()
      },
      submitRemove: function (file, fileList) {
        console.log(file, fileList)
      },
      submitPreview: function (file) {
        console.log(file)
      }
    }
  }
</script>
