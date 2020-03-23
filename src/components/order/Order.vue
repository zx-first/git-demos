<template>
    <div>
           <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
  <el-breadcrumb-item>订单列表</el-breadcrumb-item>

</el-breadcrumb>
<!-- 卡片区域 -->
<el-card >
    <el-row>
        <el-col :span="8">
           <el-input v-model="queryInfo.query" placeholder="请输入内容">
               <!-- 搜索框 -->
               <el-button slot="append" icon="el-icon-search"
               ></el-button>
           </el-input>
        </el-col>
    </el-row>
<el-table :data="orderList" border stripe>
      <el-table-column type="index"> </el-table-column>
      <el-table-column label="订单编号" prop="order_number"></el-table-column>
      <el-table-column label="订单价格" prop="order_price"></el-table-column>
      <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
              </template>
      </el-table-column>
     <el-table-column label="是否发货" prop="is_send"></el-table-column>
     <el-table-column label="下单时间" prop="create_time">
         <template slot-scope="scope">
             {{scope.row.create_time | dateFormat}}
         </template>
     </el-table-column>
     <el-table-column label="操作" prop="order_pay">
            <!-- 作用域插槽 -->
          <template slot-scope="scope">
         <el-button type="primary" icon="el-icon-edit" size="mini" @click="showOrderDialogVisible = true"></el-button>
         <el-button type="danger" icon="el-icon-location" size="mini"
         @click="showProgessBoxx"></el-button>
          </template>
     </el-table-column>
          </el-table>
            <!-- 分页区域 -->
 <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<!-- 展示修改地址的对话框 -->
<el-dialog
  title="修改订单数据"
  :visible.sync="showOrderDialogVisible"
  width="50%">
 <!-- 内容主体区域 -->
 <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
  <el-form-item label="省市区/县" prop="address1">
    <el-cascader :options="cityData" v-model="editForm.address1"></el-cascader>
  </el-form-item>
  <el-form-item label="详细地址" prop="address2">
    <el-input v-model="editForm.address2"></el-input>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showOrderDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="showOrder(scope.row.user_id)">确 定</el-button>
  </span>
</el-dialog>
<!-- 物流对话框 -->
<el-dialog
  title="物流进度"
  :visible.sync="progressDialogVisible"
  width="50%">
  <!-- 时间线 -->
 <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>
    </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      // 查询对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 订单列表
      orderList: [],
      // 总页数
      total: 0,
      // 地址栏时间线
      progressDialogVisible: false,
      // 展示修改订单列表的对话框
      showOrderDialogVisible: false,
      // 修改对话框的数据
      editForm: {
        // 1.是级联选择器所以
        address1: [],
        address2: ''
      },
      // 修改域验证的功能
      editFormRules: {
        address1: [
          { required: true,
            message: '请显示',
            trigger: 'blur' }
        ],
        address2: [
          { required: true,
            message: '请显示详细地址',
            trigger: blur }
        ]

      },
      cityData: cityData,
      // 物流
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      console.log(res)
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    // pagesize发生改变时
    handleSizeChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagesize = newPage
      this.getOrderList()
    },
    // 当前页码值发生改变时
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },

    // 点击确定按钮 提交修改对话框
    showOrder() {

    },
    // 点击按钮物流的提交对话框
    async showProgessBoxx() {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败！')
      }
      this.progressInfo = res.datat
      this.progressDialogVisible = true
      console.log(this.progressInfo)
    }
  }
}
</script>
<style lang="less" scoped>
.el-table{
    margin-top: 15px;
}
.el-cascader{
  width:100%
}
</style>
