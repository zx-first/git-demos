<template>
    <div>
          <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
     <el-card>
         <!-- 警告区域 -->
         <el-alert show-icon
    title="注意：只允许为第三级分类设置相关参数"
    type="warning" :closable="false">
  </el-alert>
  <!-- 选择商品分类区域 -->
    <el-row class="cat_opt">
        <el-col>
            <span>选择商品分类：</span>
             <!-- 级联选择框 -->
        <el-cascader expand-trigger="hover" :options="CateList" :props="CateListporps" v-model="selectedKeys" @change="parentCateChanged" clearable change-on-select>
          </el-cascader>
        </el-col>
    </el-row>
    <!-- tab页标签 -->

  <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <el-tab-pane label="动态参数" name="many">
        <!-- 添加参数按钮 -->
        <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="paddFormdialogVisible = true">添加参数</el-button>
        <!-- 动态参数表格 -->
        <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
             <el-table-column type="expand">
                 <!-- 循环tag标签数据 展示到页面 i为索引-->
                    <template slot-scope="scope">
                     <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
                     @close="handleClose(i,scope.row)">
                         {{item}}
                     </el-tag>
                     <!-- 输入的文本框 tag的用法 循环的时候绑定自己的数据 scope.row.input Visible -->
            <el-input class="input-news"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)">
             </el-input>
<!-- 添加按钮 -->
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                 </template>
             </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="showeditForm(scope.row.attr_id)">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteshoweditForm(scope.row.attr_id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only">
        <!-- 添加属性的按钮 -->
        <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="paddFormdialogVisible=true">添加属性</el-button>
        <!-- 静态属性表格 -->
         <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
             <el-table-column type="expand">
                 <!-- 循环tag标签数据 展示到页面 i为索引-->
                    <template slot-scope="scope">
                     <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
                     @close="handleClose(i,scope.row)">
                         {{item}}
                     </el-tag>
                     <!-- 输入的文本框 tag的用法 循环的时候绑定自己的数据 scope.row.input Visible -->
            <el-input class="input-news"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)">
             </el-input>
<!-- 添加按钮 -->
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                 </template>
             </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit"  @click="showeditForm(scope.row.attr_id)">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteshoweditForm(scope.row.attr_id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-tab-pane>

  </el-tabs>

     </el-card>

   <!-- 添加参数的对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="paddFormdialogVisible" width="50%"
    @close="addDialogClosed">
        <!-- 表单 -->
        <el-form :model="paramsForm" :rules="paramsFormRules" ref="paramsFormRef" label-width="100px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="paramsForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paddFormdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="parmasAddFrom">确 定</el-button>
      </span>
    </el-dialog>
      <!-- 编辑参数的对话框 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="editFormdialogVisible" width="50%"
    @close="editDialogClosed">
        <!-- 表单 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editFormdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editForms">确 定</el-button>
      </span>
    </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      CateList: [],
      // 级联选择框的自定义属性
      CateListporps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级连选择框双向绑定到的数组
      selectedKeys: [],
      // 被激活的网页的名称 默认的
      activeName: 'many',
      // 动态参数
      manyTableData: [],
      // 静态参数
      onlyTableData: [],
      // 显示与隐藏添加参数对话框
      paddFormdialogVisible: false,
      // 表单对象
      paramsForm: {
        attr_name: ''
      },
      // 表单验证对象规则
      paramsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 编辑对象的显示
      editFormdialogVisible: false,
      // 编辑表单验证对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 编辑对象
      editForm: {}
      //    //控制按钮与文本框的切换显示  BGU 会同带整个页面
      //    inputVisible: false,
      //    //文本框中输入的内容
      //    inputValue:''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.CateList = res.data
      console.log(this.CateList)
    },
    // 级连选择框变化会触发这个函数
    parentCateChanged() {
      this.getParamsData()
    },
    // Tab页签点击事件的处理函数
    handleTabClick() {
      this.getParamsData()
      console.log(this.activeName)
    },
    // 获取参数的列表数据
    async getParamsData() {
      // 证明选中的不是三级分类
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 如果选择的是三级分类
      console.log(this.selectedKeys)
      // 根据所选分类的Id，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      // 把attr_vals中字符串数据转化为数组
      res.data.forEach(item => {
        // 解决bug 用三元表达式 三目运算 如果vals值不等于空返回 这个数据，等于空返回空
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制每个数据的显示与隐藏
        item.inputVisible = false
        // 每次循环把tag标签的 文本框设置为空
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // params添加分类的关闭事件
    addDialogClosed() {
      this.$refs.paramsFormRef.resetFields()
    },
    // parmas添加表单事件
    parmasAddFrom() {
      // 先验证提交事件
      this.$refs.paramsFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.paramsForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.paddFormdialogVisible = false
        this.getParamsData()
      })
    },
    // 编辑提交表单
    async showeditForm(attr_id) {
      // 查询当前参数信息
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
        params: { attr_sel: this.activeName }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('编辑参数失败')
      }
      this.editForm = res.data
      this.editFormdialogVisible = true
    },
    // params添加分类的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮编辑提交表单
    editForms() {
      // 验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 验证通过
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}}`,
          {
            attr_name: this.editForm.attr_name, attr_sel: this.activeName
          })
        if (res.meta.status !== 200) {
          return this.$message.error('提交表单失败')
        }
        this.$message.success('修改参数表单成功')
        this.getParamsData()
        this.editFormdialogVisible = false
      })
    },
    // 删除按钮parmas
    async deleteshoweditForm(attr_id) {
      // 删除弹出确认框 因为是异步所以要加关键字
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除表单失败')
      }
      this.$message.success('删除表单成功')
      this.getParamsData()
    },
    // 文本框失去焦点 或者按下entre建都会触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return ，则证明输入的内容，需要后续处理
      // 在数组中push加入数据
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = '',
      row.inputVisible = false
      // 调自定义的函数
      this.saveAAttrVals(row)
    },
    // 点击事件,点击按钮展示文本框的 改变inputVisible的属性
    showInput(row) {
      // 接收数据 并且把tag 文本框改成显示
      row.inputVisible = true
      // 让文本框自动活得焦点
      // $nextTick 方法的作用，就是当页面上的元素
      // 被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 认命处理函数 将对attr_vals的操作 保存到数据库
    async saveAAttrVals(row) {
      // 需要发起请求，保存这次操作
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        // 因为服务器只接受字符串 所有要把数组拼接成字符串
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改文本框失败')
      }
      this.$message.success('修改框添加成功')
    },
    // 删除文本框
    handleClose(i, row) {
      // 删除一项 splice修改原数组
      row.attr_vals.splice(i, 1)
      // 调自定义的函数
      this.saveAAttrVals(row)
    }
  },
  // 定义的新节点 来计算属性
  computed: {
    // 如果按钮需要被禁用，则返回true，否则返回false
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }

  }
}

</script>

<style lang="less" scoped>
.cat_opt{
    margin: 15px 0;
}
.el-tag{
    margin: 5px;
}
.input-news{
    width: 120px;
}

</style>
