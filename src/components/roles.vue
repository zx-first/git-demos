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
      <el-button type="primary">添加角色</el-button>
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
              <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete">删除</el-button>
                    <el-button type="warning" icon="el-icon-setting" @click="showallocation(scope.row)">分配权限</el-button>
              </template>
          </el-table-column>
      </el-table>
  </el-card>
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
    data(){
        return{
            getrolesList: [],
            //分配权限
            setRightDialogVisible: false,
            rightslist:[],
            //树形控件的属性绑定对象
           treeProps:{
               label: 'authName',
               children: 'children'
           },
           //默认勾选的节点 用递归函数 
           defaulttreeid:[],
           //当前即将分配权限的id
           roleId:''
        }
    },
    created(){
        this.getrolesLista();
    },
    methods:{
    async getrolesLista(){
            const {data:res}=await this.$http.get('roles')
            if(res.meta.status !==200){
                return this.$message.error('获取角色数据列表失败')
            }
            this.getrolesList=res.data
            console.log(this.getrolesList)
        },
        async removeRightyId(role,rightId){
            // 删除弹出确认框 因为是异步所以要加关键字
          const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult !=='confirm'){
            return this.$message.info('取消了删除')
        }
        // console.log("确认删除u") 根据2个id 传参数
        const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status !==200){
            return this.$message.error('删除权限失败')
        }
        // 把服务器的数据 赋值给role.children属性
        role.children=res.data
        },
        //分配权限
        async showallocation(role){
            this.roleId=role.id
            //获取所以权限的数据
            const {data:res}=await this.$http.get('rights/tree')
            if(res.meta.status !==200){
                return this.$message.error('获取权限数据失败')
            }
            //获取数据给数组响应到网页
            this.rightslist=res.data
            console.log(this.rightslist)
            //递归获取三级节点的id
            this.getLeafKeys(role,this.defaulttreeid)
            this.setRightDialogVisible=true
        },
        //递归函数 如果当前nod节点不包含 children属性 则是三级节点
        getLeafKeys(node,arr){
            if(!node.children){
                return arr.push(node.id)
            }
            //如果是
            node.children.forEach(item => 
            this.getLeafKeys(item,arr) 
            );
        },
        //当前节点关闭清除id
        setRightDialogClose(){
            this.defaulttreeid=[]
        },
        //角色权限分配 半节点 全节点数组拼接
        async allotRights(){
            const keys=[
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const idStr= keys.join(',')
            const {data: res}= await this.$http.post(`roles/${this.roleId}/rights`,{rids: idStr})
            if(res.meta.status !==200){
                return this.$message.error('分配权限失败!')
            }
            this.$message.success('分配权限成功')
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
</style>