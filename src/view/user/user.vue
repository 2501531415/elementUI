<template>
<div class="user">
     <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-row :gutter="20">
          <el-col :span="8">
               <el-input  placeholder="请输入内容" v-model="userDate.query" clearable @clear="clearDate">
            <el-button  slot="append" icon="el-icon-search" @click="search" ></el-button>
        </el-input>
          </el-col>
          <el-col :span="2">
              <el-button type="primary" @click="adduser">添加用户</el-button>
          </el-col>
        </el-row>
       <el-table :data="userList" border >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态"> 
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state"  @change="changeState(scope.row.id,scope.row.mg_state)"></el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="editForm(scope.row.id)"></el-button>
                <el-button type="warning" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
                <el-tooltip effect="dark" content="分配角色" placement="top">
                <el-button type="danger" icon="el-icon-star-off" @click="getRole(scope.row)"></el-button>    
                </el-tooltip>
            </template>
        </el-table-column>
       </el-table>
       <!-- 分页 -->
           <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userDate.pagenum"
      :page-sizes="[1, 3, 5, 7]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
            <el-dialog title="添加用户"  :visible.sync="addFormVisible" @close="addDialogClose">
                <el-form   :model="addList" :rules="rules" status-icon ref="addForm"> 
                <el-form-item label="姓名" prop="username"><el-input v-model="addList.username" placeholder="姓名"></el-input></el-form-item>
                <el-form-item label="密码" prop="password"><el-input v-model="addList.password"  placeholder="密码"></el-input></el-form-item>
                <el-form-item label="邮箱" prop="email"><el-input  v-model="addList.email" placeholder="邮箱"></el-input></el-form-item>
                <el-form-item label="电话" prop="mobile"><el-input v-model="addList.mobile" placeholder="电话"></el-input></el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSubmit">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="修改信息" :visible.sync="dialogFormVisible" @close="editDialogClose">
                <el-form  :rules="editRule" :model="editList"  status-icon ref="editForm"> 
                <el-form-item label="姓名"><el-input placeholder="姓名" v-model="editList.username"  disabled="disabled"></el-input></el-form-item>
                <el-form-item label="邮箱" prop="email"><el-input  v-model="editList.email" placeholder="邮箱"></el-input></el-form-item>
                <el-form-item label="电话" prop="mobile"><el-input v-model="editList.mobile" placeholder="电话"></el-input></el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editSubmit(editList.id)">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="分配角色" :visible.sync="roleVisible" @close="roleDialogClose">
                <div>
                    <p>当前姓名:{{roleInfo.username}}</p>
                    <p>当前角色:{{roleInfo.role_name}}</p>
                    <p>
                    分配角色<el-select v-model="selectValueId">
                        <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
                    </el-select>
                    </p>
                </div>
                <div class="dialog-footer" slot="footer">
                    <el-button @click="roleVisible = false">取 消</el-button>
                <el-button type="primary" @click="roleSubmit">确 定</el-button>
                </div>
            </el-dialog>
</div>
</template>
<script>
import {getUser,getState,getMessage,addUser,editForm,userDelete,submitRole} from '../../network/user.js'
import {getRoles} from '../../network/rights.js'
export default {
name: 'user',
created () {
    this.getUser()  
},
mounted () {
},
data () {
    const checkMobile = (rule, value, cb) => {
    let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    if (reg.test(value)) {
        cb()
    } else {
    cb(new Error('手机号码格式不正确'))
    }
    };
    const checkEmail = (rule,value,cb) =>{
    let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if(reg.test(value)){
        cb()
    }else{
        cb(new Error('邮箱号格式不正确'))
    }
    };
    return {
        addList:{
            username:'',
            password:'',
            email:'',
            mobile:'',
        },
        userList:[],
        roleList:[],
        selectValueId:'',
        roleInfo:[],
        userDate:{  
            query:'',
            pagenum:1,
            pagesize:2},
        total:null,
        dialogFormVisible: false,
        addFormVisible:false,
        roleVisible:false,
        editList:{},
        rules:{
            username:[{required:true,message:'请输入姓名',trigger:'blur'}],
            password:[{required:true,message:'请输入密码',trigger:'blur'}],
            email:[{required:true,message:'请输入邮箱号',trigger:'blur'},{validator:checkEmail,trigger:'blur'}],
            mobile:[{required:true,message:'请输入手机号',trigger:'blur'},{validator:checkMobile,trigger:'blur'}]
        },
        editRule:{
            email:[
               {required:true,message:'请输入邮箱号',trigger:'blur'},
               {validator:checkEmail,trigger:'blur'}
                ],
            mobile:[
                {required:true,message:'请输入手机号',trigger:'blur'},
                {validator:checkMobile,trigger:'blur'}
                ]
        }
    }
},
methods: {
    getUser(){
        getUser(this.userDate).then(res =>{
            // console.log(res.data)
            this.userList = res.data.users
            this.total = res.data.total
        }).catch(err=>{
           this.$message.error('获取用户列表失败')
        })
    },
    changeState(uid,state){
        getState(uid,state).then(res=>{

        }).catch(err=>{
            this.$message.error('修改失败')
        })
    },
    handleSizeChange(val){
        this.userDate.pagesize= val
        this.getUser(this.userDate)
    },
    handleCurrentChange(val){
         this.userDate.pagenum= val
        this.getUser()
    },
    // 搜索方法
    search(){
       this.getUser()
    },
    clearDate(){
        this.getUser()
    },
    adduser(){
        this.addFormVisible = true
    },
    addDialogClose(){
        this.$refs.addForm.resetFields()
    },
    editDialogClose(){
        this.$refs.editForm.resetFields()
    },
    // 添加用户方法
    addSubmit(){
        this.$refs.addForm.validate(valid=>{
            if(!valid) return
            addUser(this.addList).then(res=>{
                console.log(res)
           if(res.meta.status == 201){
                this.$message.success(res.meta.msg)
                this.addFormVisible = false
                this.addDialogClose()

           }else{
                this.$message.error(res.meta.msg)
           }
        }).catch(err=>{
            this.$message.error('创建用户失败')
        })
        })
       
    },
    editForm(id){
       getMessage(id).then(res=>{
        //    console.log(res)
           this.editList = res.data
            this.dialogFormVisible = true
        })
    },
    del(id){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          userDelete(id).then(res=>{
            this.getUser()  
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
    editSubmit(id){
        this.$refs.editForm.validate(valid=>{
            if(!valid) return 
            editForm(id,this.editList).then(res=>{
               if(res.meta.status !=200){
                   this.$message.error('修改失败')
               }else{
                this. dialogFormVisible = false
                this.getUser()
                this.$message.success('修改成功')
               }
            })
        })
    },
    getRole(Info){
        this.roleInfo = Info
        console.log(this.roleInfo)
        getRoles().then(res=>{
            // console.log(res)
            this.roleList = res.data
            this.roleVisible = true
        })
        
    },
    roleSubmit(){
        console.log(this.selectValueId)
        if(!this.selectValueId){
            return this.$message.error('不能分配空的角色')
        }
        submitRole(this.roleInfo.id,this.selectValueId).then(res=>{
            if(res.meta.status !=200){
                 this.$message.error('分配角色失败')
            }else{
                this.roleVisible = false
                this.getUser()
            }
        })
    },
    roleDialogClose(){
        this.selectValueId = '',
        this.roleInfo = ''
    }
}
}
</script>
<style scoped>

</style>