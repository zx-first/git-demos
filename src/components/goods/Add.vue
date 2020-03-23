<template>
    <div>
        <!-- 面包屑 -->
             <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片式图 -->
<el-card >
    <!-- 提示区域 -->
      <el-alert
    title="警告提示的文案"
    type="warning" :closable="false">
  </el-alert>
    <!-- 步骤条区域 -->
    <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
</el-steps>
<!-- 2组件共用同一数据项 把长得像数字的字符串 转换为数值 - 0 -->
<!-- tab栏的渲染 -->
<el-form :model="addForm" :rules="addFormRules" ref="addFormRule" label-width="100px" label-position="top">
  <el-tabs v-model="activeIndex" :tab-position="'left'"
  :before-leave="beforeTabLeave" @tab-click="tabClicked">
    <el-tab-pane label="基本信息" name="0">
       <el-form-item label="商品名称" prop="goods_name">
    <el-input v-model="addForm.goods_name"></el-input>
      </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
    <el-input v-model="addForm.goods_price"></el-input>
      </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
    <el-input v-model="addForm.goods_number"></el-input>
      </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
    <el-input v-model="addForm.goods_weight"></el-input>
      </el-form-item>
      <!-- 级联选择器 -->
      <el-form-item label="商品分类" prop="goods_cat">
           <el-cascader expand-trigger="hover" :options="addFormAarrey"
           :props="catPorops" v-model="addForm.goods_cat"
           @change="hanleCateChanged" clearable change-on-select>
          </el-cascader>
      </el-form-item>

    </el-tab-pane>
    <el-tab-pane label="商品参数" name="1">
        <!-- 渲染表单item项 -->
        <el-form-item :label="item.attr_name" v-for="item in manyTableData"
        :key="item.attr_id">
        <!-- 复选框 -->
        <el-checkbox-group v-model="item.attr_vals">
            <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border=""></el-checkbox>
        </el-checkbox-group>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="2">
        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="3">
        <!-- action 图片要上传到后台接口的API地址 后台地址拼上upload
        on-preview 处理图片预览效果 on-remove 单击x号立即调用
        on-remove的函数 file-list指定文件列表 可删除 list
        -type 指定浏览的时候呈现方式-->
        <el-upload
        action="http://127.0.0.1:8888/api/private/v1/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        list-type="picture" :headers="headerObj"
        :on-success="handleSuccess">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">
        <!-- 富文本编辑器 -->
         <quill-editor v-model="addForm.goods_introuce">
         </quill-editor>
         <!-- 添加商品的按钮 -->
         <el-button type="primary" @click="add()">添加商品</el-button>
    </el-tab-pane>

  </el-tabs>
</el-form>
</el-card>
<!-- 图片预览 -->
<el-dialog
  title="提示"
  :visible.sync="prewiewVisible"
  width="50%">
  <!-- 注意时间绑定 -->
 <img :src="previewPath" alt="" class="previewImg">

</el-dialog>
    </div>
</template>

<script>
import _perperty from 'lodash'
// 官方定义一般用下划线接收
export default {
  data() {
    return {
      // 激活属性
      activeIndex: '0',
      // 添加表单
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        // 商品所属的分类数组
        goods_cat: [],
        // 图片数组
        pics: [],
        // 添加内容
        goods_introuce: '',
        // 接口中的新增数组来存动态静态数组数据
        attrs: []
      },
      // 查询商品列表数据
      addFormAarrey: [],
      // 级联选择框显示的数据
      catPorops: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数的数组数据
      manyTableData: [],
      // 静态参数的数组数据
      onlyTableData: [],

      // 添加表单验证对象
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名字', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 图片上传设置请求头
      headerObj: {
        Authorization:
                window.sessionStorage.getItem('token')
      },
      // 图片路径
      previewPath: '',
      // 控制预览对话框的显示与影藏
      prewiewVisible: false
    }
  },
  created() {
    this.addgoodsList()
  },
  methods: {
    async addgoodsList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        this.$message.error('获取商品列表失败')
      }
      this.addFormAarrey = res.data
      console.log(this.addFormAarrey)
    },
    // 级联选择器变化触发的函数
    hanleCateChanged() {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 阻止标签页的切换
    beforeTabLeave(activeName, oldActiveName) {
      // console.log('即将要离开的标签页名字是：'+oldActiveName)
      // console.log('即将要进入的标签页的名字是:'+activeName)
      if (oldActiveName === '0' && this.addForm.goods_cat.length !==
            3) {
        this.$message.error('请输入标签页')
        return false
      }
    },
    // 选择表单时点击的事件
    async tabClicked() {
      // console.log(this.activeIndex)
      // 证明访问的是动态参数面板
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
          { params: { sel: 'many' } })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数失败')
        }

        // 把字符串转化为数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? []
            : item.attr_vals.split(' ')
        })
        console.log(res.data)
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
          { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数失败')
        }
        console.log(res.data)
        this.onlyTableData = res.data
      }
    },
    // 上传图片处理图片预览效果
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.prewiewVisible = true
    },
    // 删除图片按钮
    handleRemove(file) {
      //    console.log(file)
      // 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2.从pics数组中，找到这个图片的对应索引值
      const i = this.addForm.price.findIndex(x => x.pic === filePath)
      // 3.调用数组的splice方法 把图片信息对象 从pice数组中移除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 监听图片上传成功事件
    handleSuccess(response) {
      console.log(response)
      // 1.拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path
      }
      // 将图片信息对象，push到pic数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 添加验证表单
    add() {
      this.$refs.addFormRule.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 执行添加的业务逻辑
        // 注意这个时候，因为之前用了级联选择器 如果把addform转换成
        // 字符串 级联选择器中addForm数组里面里面的东西也会转换,但无法转换所以就会报cuo
        // 这个时候要用loash中 cloneDeep(obj) 深拷贝
        const form = _perperty.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 把动态静态 存入到 接口文档的attrs数组中
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id, attr_value: item.attr_vals.join('')
          }

          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id, attr_value: item.attr_vals
          }
          // newInfo=JSON.parse(JSON.stringify(newInfo))
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        // 发起商品添加
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        // 如果成功可以通过编程导航跳转
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 定义的计算属性
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox{
    //提高优先级 !important
    margin: 0 5px 0 0 !important;
}
.previewImg{
    width: 100%;
}
.el-button{
    margin-top: 15px;
}

</style>
