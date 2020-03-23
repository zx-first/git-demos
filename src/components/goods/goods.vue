<template>
    <div>
        <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>

</el-breadcrumb>
<el-card>
    <el-row :gutter="20">
        <!-- 输入框 -->
        <el-col :span="8">
              <el-input placeholder="请输入内容"
    v-model="queryInfo.query" clearable @clear="getgoodsList">
    <el-button slot="append" icon="el-icon-search"
    @click="getgoodsList"></el-button>
  </el-input>
        </el-col>
        <el-col :span="4">
             <!-- 添加按钮  -->
    <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>

    <!-- table表格组件 -->
         <el-table :data="goodsList" border stripe>
              <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
       <el-table-column label="商品价格(元)" prop="goods_price" width="80px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
       <el-table-column label="创建时间" prop="add_time" width="150px">
           <template slot-scope="scope">
               <!-- 竖线 调用格式化回见过滤器 -->
               {{scope.row.add_time |dateFormat}}
           </template>
       </el-table-column>
        <el-table-column label="操作" width="130px">
            <!-- 作用域插槽 来接收里面的数据 -->
            <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showGoodsioDialog(scope.row.goods_id)"></el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoodsById(scope.row.goods_id)"></el-button>
            </template>
            </el-table-column>
         </el-table>
    </el-row>
    <!-- 分页 -->
 <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>
    </el-pagination>
</el-card>
<!-- 添加商品 -->

 <!-- 修改商品 -->
 <!-- <el-dialog
  title="修改商品"
  :visible.sync="editDialogVisible"
  width="50%" @close="editDialogClosed">

 <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
  <el-form-item label="用户名" prop="username">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog> -->
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取商品列表的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0,

      //     //商品验证对象
      //     addFormRules:{
      //            goods_name:[
      //       {
      //           required: true,message:'请输入商品名字',
      //           trigger:'blur'
      //       },
      //       { min:3,max:10,message:'请输入3-10个字符串',trigger:'blur'}
      //   ],
      //      goods_cat:[
      //       {
      //           required: true,message:'请输入商品名字',
      //           trigger:'blur'
      //       },
      //       { min:3,max:10,message:'请输入3-10个字符串',trigger:'blur'}
      //   ],
      //    goods_price:[
      //       {
      //           required: true,message:'请输入商品价格',
      //           trigger:'blur'
      //       },
      //       { min:3,max:10,message:'请输入3-10个字符串',trigger:'blur'}
      //   ],
      //     goods_number:[
      //       {
      //           required: true,message:'请输入商品数量',
      //           trigger:'blur'
      //       },
      //       { min:3,max:10,message:'请输入3-10个字符串',trigger:'blur'}
      //   ],
      //    goods_weight:[
      //       {
      //           required: true,message:'请输入商品重量',
      //           trigger:'blur'
      //       },
      //       { min:3,max:10,message:'请输入3-10个字符串',trigger:'blur'}
      //   ],
      //    goods_introduce:[
      //       {
      //           required: true,message:'请输入商品介绍',
      //           trigger:'blur'
      //       },
      //       { min:3,max:10,message:'请输入3-10个字符串',trigger:'blur'}
      //   ],

      // },
      // 控制编辑对话框 的显示与隐藏
      editDialogVisible: false,
      // 编辑按钮对象的获取
      editForm: {

      }

    }
  },
  created() {
    // 创建商品列表
    this.getgoodsList()
  },
  methods: {
    async getgoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.$message.success('获取商品数据列表成功')
      console.log(res.data)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 监听 pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getgoodsList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getgoodsList()
    },
    // 删除表单按钮
    async removeGoodsById(id) {
      // 弹框询问用户是否删除数据
      const confirmres = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      console.log(confirmres)
      // 如果用户确认删除 返回值是confirm
      // 反之 取消 cancel
      if (confirmres !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete(`goods/${id}`)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getgoodsList()
    },
    // 展示编辑用户对话框
    async showGoodsioDialog(id) {
      console.log(id)
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }

      // 把数据填充给修改表单
      this.editForm = res.data
      editDialogVisible = true
    },
    // 点击按钮添加商品
    addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('goods', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败!')
        }
        this.$message.success('添加用户成功!')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取数据
        this.getgoodsList()
      })
    },
    // 监听商品添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加页面的跳转
    goAddpage() {
      this.$router.push('/goods/Add')
    }
  }
}
</script>

<style lang="less" scope>

</style>
