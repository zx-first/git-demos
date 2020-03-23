<template>
    <div>
          <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片区域 -->
  <el-card>
      <el-button type="primary" @click="addRoleDialogVisible=true">添加角色</el-button>
      <el-table :data="getrolesList" border stripe>
          <!-- 展开列 -->
          <el-table-column type="expand">
              <template slot-scope="scope">
                  <el-row :class="['bdbottom', i1 ===0 ? 'bdtop':'','viventer']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                      <!-- 一级权限 -->
                      <el-col :span="5" >
                        <el-tag closable @close="removeRightyId(scope.row,item3.id)">{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <!-- 二级权限 三级权限 -->
                      <el-col :span="19">
                         <el-row :class="[ i2===0 ? '':'bdtop','viventer']" v-for="(item2,i2) in item1.children" :key="item2.id" >
                             <el-col :span="6">
                             <el-tag type="success" closable @close="removeRightyId(scope.row,item3.id)">{{item2.authName}}</el-tag>
                             <i class="el-icon-caret-right"></i>
                         </el-col>
                         <el-col :span="18">
                             <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable @close="removeRightyId(scope.row,item3.id)">
                                 {{item3.authName}}
                             </el-tag>
                         </el-col>
                         </el-row>
                      </el-col>
                  </el-row>
                  <!-- <pre>{{scope.row}}</pre> -->
              </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="380px">
              <template slot-scope="scope" >
                    <el-button type="primary" icon="el-icon-edit"  size="mini" @click="showEditRoles(scope.row.id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete"  size="mini" @click="showDeleteRols(scope.row.id)">删除</el-button>
                    <el-button type="warning" icon="el-icon-setting" @click="showallocation(scope.row)"  size="mini">分配权限</el-button>
              </template>
          </el-table-column>
      </el-table>
  </el-card>
  <!--编辑对话框 -->
  <el-dialog
  title="修改角色"
  :visible.sync="editDialogVisible"
  width="30%" @close="editRolecolse">
 <!-- 编辑表单 -->
  <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
  <el-form-item label="角色名称"  prop="roleName">
    <el-input v-model="editForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述"  prop="roleDesc">
    <el-input v-model="editForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editConfirmDialogVisible">确 定</el-button>
  </span>
</el-dialog>
<!-- 添加角色对话框 -->
<!-- 添加用户 -->
<el-dialog
  title="添加角色"
  :visible.sync="addRoleDialogVisible"
  width="50%">
  <!-- 内容主体区域 -->
 <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="100px" >
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addRoleForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="addRoleForm.roleDesc"></el-input>
  </el-form-item>
 </el-form>
  <!-- d底部区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary"  @click="addRole">确 定</el-button>
  </span>
</el-dialog>
  <!-- 分配权限对话框 -->
  <el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClose">
  <!-- 树形结构  node-key 选中的id-->
  <el-tree
  :data="rightslist"
  :props="treeProps"
  show-checkbox node-key="id" default-expand-all :default-checked-keys="defaulttreeid" ref="treeRef">
</el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      getrolesList: [],
      // 分配权限
      setRightDialogVisible: false,
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认勾选的节点 用递归函数
      defaulttreeid: [],
      // 当前即将分配权限的id
      roleId: '',
      // 编辑对话框展现与隐藏
      editDialogVisible: false,
      // 编辑对话框查询角色
      editForm: {

      },
      // 编辑对话框验证角色信息
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '请输入2-10个字符串', triggeer: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 15, message: '请输入2-15个字符串', trigger: 'blur' }

        ]
      },
      // 添加角色
      addRoleForm: {

        roleName: '',
        roleDesc: ''
      },
      // 验证添加角色
      addRoleFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          { min: 2, max: 10, message: '请输入2-10个字符串', trigger: 'blur' }
        ],
        roleDesc: [
          {
            required: false,
            message: '请输入密码',
            trigger: 'blur'
          },
          { min: 2, max: 15, message: '密码的长度2-15个字符串', trigger: 'blur' }
        ]
      },
      // 控制显示添加角色
      addRoleDialogVisible: false
    }
  },
  created() {
    this.getrolesLista()
  },
  methods: {
    async getrolesLista() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色数据列表失败')
      }
      this.getrolesList = res.data
      console.log(this.getrolesList)
    },
    async removeRightyId(role, rightId) {
      // 删除弹出确认框 因为是异步所以要加关键字
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      // console.log("确认删除u") 根据2个id 传参数
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      // 把服务器的数据 赋值给role.children属性
      role.children = res.data
    },
    // 分配权限
    async showallocation(role) {
      this.roleId = role.id
      // 获取所以权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      // 获取数据给数组响应到网页
      this.rightslist = res.data
      console.log(this.rightslist)
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defaulttreeid)
      this.setRightDialogVisible = true
    },
    // 递归函数 如果当前nod节点不包含 children属性 则是三级节点
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果是
      node.children.forEach(item =>
        this.getLeafKeys(item, arr)
      )
    },
    // 当前节点关闭清除id
    setRightDialogClose() {
      this.defaulttreeid = []
    },
    // 角色权限分配 半节点 全节点数组拼接
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败!')
      }
      this.$message.success('分配权限成功')
    },
    // 编辑对话框的展示
    async showEditRoles(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色数据失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 关闭清空编辑对话框的内容
    editRolecolse() {
      this.$refs.editFormRef.resetFields()
    },
    // 提交修改表单验证域名对话框
    editConfirmDialogVisible() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息请求
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }

        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getrolesLista()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    },
    // 删除角色列表  引入message Box
    async showDeleteRols(id) {
      const confirms = await this.$confirm('此操作将永久删除角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch(err => {
        return err
      })
      console.log(confirms)
      if (confirms !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除数据失败')
      }
      this.$message.success('删除角色成功')
      this.getrolesLista()
    },
    // 添加角色功能
    addRole() {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败!')
        }
        this.$message.success('添加用户成功!')
        console.log(res.data)
        // 隐藏添加用户的对话框
        this.addRoleDialogVisible = false
        // 重新获取数据
        this.getrolesLista()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
    margin: 7px;

}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.viventer{
    display: flex;
    align-items: center;
}
.el-table{
    margin-top: 15px;
}
</style>
