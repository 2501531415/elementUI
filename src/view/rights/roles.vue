<template>
<div class="roles">
    <el-breadcrumb>
        <el-breadcrumb-item :to="{path:'/welcome'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>    
    <el-card>
        <el-row>
          <el-col><el-button type="primary" @click="addRoleDialog">添加角色</el-button></el-col>
        </el-row>
        <el-table :data="rolesList">
          <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row :class="['bottomLine',index == 0?'topLine':'','row' ]" v-for="(item1,index) in scope.row.children" :key="index">
                  <el-col :span="5"><el-tag>{{item1.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
                  <el-col :span="19">
                      <el-row :class="[indey == 0?'':'topLine','row']" v-for="(item2,indey) in item1.children" :key="indey">
                        <el-col :span="6"><el-tag type="success" closable @close="closeRight(scope.row,item2.id)">{{item2.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
                        <el-col :span="18">
                              <el-col><el-tag type="warning" v-for="(item3,indez) in item2.children" :key="indez" closable  @close="closeRight2(scope.row,item3.id)">{{item3.authName}}</el-tag></el-col>
                        </el-col>
                      </el-row>
                  </el-col>
                </el-row>
              </template>
          </el-table-column>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="角色" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="editForm(scope.row)">编辑</el-button>
                <el-button type="warning" icon="el-icon-delete" @click="del(scope.row.id)">删除</el-button>
                <el-button type="danger" icon="el-icon-star-off" @click="right(scope.row)">分配权限</el-button>    
                
            </template>
          </el-table-column>
        </el-table>
    </el-card>
    <el-dialog title="添加用户"  :visible.sync="addFormVisible" @close="addFormClose">
                <el-form   :model="addrole" :rules="rules" status-icon ref="addForm"> 
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addrole.roleName" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addrole.roleDesc"  placeholder="角色描述"></el-input>
                </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="formSubmit">确 定</el-button>
                </div>
    </el-dialog>

        <!-- 编辑角色dialog -->
        <el-dialog title="编辑角色" :visible.sync="editFormVisible" @close="editFormClose">
            <el-form ref="editForm" :model="editrole" status-icon :rules="editRules">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editrole.roleName" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editrole.roleDesc" placeholder="角色描述"></el-input>
                </el-form-item>
            </el-form>
             <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editFormSubmit">确 定</el-button>
                </div>
        </el-dialog>
        <!-- 分配权限dialog -->
        <el-dialog title="分配权限" :visible.sync="roleVisible" width="50%" @close="rightClose">
            <el-tree :data="rightList" :props="defaultProps" 
            show-checkbox 
            default-expand-all 
            node-key="id"
            :default-checked-keys="definKey" ref="tree">
            </el-tree> 
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleVisible = false">取 消</el-button>
                <el-button type="primary" @click="rightSubmit">确 定</el-button>
            </div>
        </el-dialog>
</div>
</template>
<script>
import {getRoles,rightsDel,addRoles,checkRoles,editFormSubmit,delRoles,getRights,rightsSubmit} from '../../network/rights.js'
export default {
name: 'roles',
data () {
    return {
        rolesList:[],
        addFormVisible:false,
        editFormVisible:false,
        roleVisible:false,
        addrole:{
            roleName:'',
            roleDesc:''
        },
        editrole:{

        },
        rules:{
            roleName:[{required:true,message:'请输入角色名称',trigger:'blur'}],
            roleDesc:[{required:true,message:'请输入角色描述',trigger:'blur'}]
        },
        editRules:{
            roleName:[{required:true,message:'请输入角色名称',trigger:'blur'}],
            roleDesc:[{required:true,message:'请输入角色描述',trigger:'blur'}]
        },
        checkEditForm:'',
        type:'tree',
        rightList:[],
        defaultProps:{
            label:'authName',
            children:'children'
        },
        definKey:[],
        ridKey:[]
    }
},
created () {
    this.getRoles()
},
methods: {
    getRoles(){
        getRoles().then(res=>{
            // console.log(res)
            this.rolesList = res.data
            // console.log(this.rolesList)
        })
    },
    closeRight(role,rightId){
        console.log(rightId)
        this.$confirm('你确定要删除该权限吗','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            rightsDel(role.id,rightId).then(res=>{
                if(res.meta.status !=200) return 
                role.children = res.data
                 this.$message({
                type:'success',
                message:'删除权限成功'
            })
            })
        }).catch(()=>{
             this.$message({
                type:'error',
                message:'删除权限失败'
            })
        })
    },
    closeRight2(role,rightId){
        this.$confirm('你确定要删除该权限吗','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            rightsDel(role.id,rightId).then(res=>{
                if(res.meta.status !=200) return 
                role.children = res.data
                 this.$message({
                type:'success',
                message:'删除权限成功'
            })
            })
        }).catch(()=>{
             this.$message({
                type:'error',
                message:'删除权限失败'
            })
        })
    },
    // 添加用户提示框
    addRoleDialog(){
        this.addFormVisible = true
    },
    // 重置添加用户表单
    addFormClose(){
        // console.log(this.$refs.addForm)
       this.$refs.addForm.resetFields()
    },
    // 提交添加用户
    formSubmit(){
        addRoles(this.addrole).then(res=>{
            this.$refs.addForm.validate(valid=>{
                if(!valid) return 
                if(res.meta.status !=201){
                    this.$message.error('添加角色失败')
                }else{
                    this.$message.success('添加角色成功')
                    this.addFormVisible = false
                    this.addFormClose()
                    this.getRoles()
                }
            })
        })
    },
    // 编辑角色
    editForm(Info){
        checkRoles(Info.id).then(res=>{
            if(res.meta.status != 200){
                this.$message.error('获取角色内容错误')
            }else{
                this.editFormVisible = true
                 this.editrole = res.data
            }
           
        })
    },
    // 重置编辑表表单
    editFormClose(){
        this.$refs.editForm.resetFields()
    },
    // 提交编辑
    editFormSubmit(){
        editFormSubmit(this.editrole).then(res=>{
            if(res.meta.status !=200){
                return this.$message.error('编辑角色失败')
            }else{
                this.editFormVisible = false
                this.$message.success('修改角色成功')
                this.getRoles()
            }
        })
    },
    del(id){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delRoles(id).then(res=>{
           this.getRoles()
            this.$message({
            type: 'success',
            message:'成功删除'
          })     
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 分配所有权限
    right(node){  
        getRights(this.type).then(res=>{     
            this.getkey(node,this.definKey) 
            this.rightList = res.data
            this.roleId = node.id
            this.roleVisible = true
        })
       
    },
    // 获取第三级的id（递归）
    getkey(node,arr){
        if(!node.children){
            return arr.push(node.id)
        }
        node.children.forEach(item=>
            this.getkey(item,arr))
    },
    // 取消之后重置数据
    rightClose(){
        this.rightList = []
        this.definKey  = []
    },
    // 提交
    rightSubmit(){
         this.ridKey = [...this.$refs.tree.getHalfCheckedKeys(),...this.$refs.tree.getCheckedKeys()]
         const keyStr = this.ridKey.join(',')
        rightsSubmit(this.roleId,keyStr).then(res=>{
            if(res.meta.status !=200){
                return this.$message.error('分配权限失败')
            }else{
                this.$message.success('分配权限成功')
                this.getRoles()
                this.roleVisible = false
            }
        })
    }
    
}

    
}
</script>
<style scoped>
.el-tag{
    margin: 7px
}
.row{
    display: flex;
    align-items: center
}
.topLine{
    border-top: 1px solid #eee
}
.bottomLine{
    border-bottom: 1px solid #eee
}
</style>