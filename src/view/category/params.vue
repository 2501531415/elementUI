<template>
<div class="params">
<el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>分类管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-alert title="注意:只允许为第三级分类设置参数" type="warning" show-icon></el-alert>
        <div class="casc">
            选择商品分类：
            <el-cascader :options="CategoryList" :props="Keys" v-model="cascaderKey" clearable @change="CascaderChange"></el-cascader>
        </div>
    <!-- 选项卡 -->
        <el-tabs @tab-click="handleClick" v-model="activeName">
            <el-tab-pane label="动态参数" name="many">
                <el-button type="primary" :disabled="isdisabled" @click="addParams">添加参数</el-button>
                <el-table :data="paramsData" border stripe >
                      <el-table-column type="expand">
                           <template slot-scope="scope">
                            <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" type="success"  
                            closable
                            @close="tagClose(index,scope.row)">{{item}}</el-tag>
                            <el-input
                                 class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                    </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                          </template>
                      </el-table-column>
                      <el-table-column label="#" type="index"></el-table-column>
                      <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                      <el-table-column label="操作">
                          <template slot-scope="scope">
                              <el-button type="primary" icon="el-icon-edit" @click="editParams(scope.row)">修改</el-button>
                              <el-button type="danger" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
                          </template>
                      </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
                <el-button type="primary" :disabled="isdisabled" @click="addParams">添加参数</el-button>
                <el-table :data="paramsData" border stripe>
                      <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" type="success"  
                            closable @close="tagClose(index,scope.row)">{{item}}</el-tag>
                            <el-input
                                 class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                    </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                          </template>
                      </el-table-column>
                      <el-table-column label="#" type="index"></el-table-column>
                      <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                      <el-table-column label="操作">
                          <template slot-scope="scope">
                              <el-button type="primary" icon="el-icon-edit" @click="editParams(scope.row)">修改</el-button>
                              <el-button type="danger" icon="el-icon-delete" @click=" deleteParams(scope.row)">删除</el-button>
                          </template>
                      </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>
        <!-- addparams dialog -->
        <el-dialog title="添加参数" :visible.sync="addParamsDialog" width="40%" @close="addParamsClose">
            <el-form :model="addFormParams" :rules="addFormRule" ref="addForm">
              <el-form-item label="参数名称" prop="name">
                  <el-input v-model="addFormParams.name" placeholder="请输入参数名称"></el-input>
              </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                 <el-button @click="addParamsDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitParams">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改dialog -->
        <el-dialog title="编辑参数" :visible.sync="editParamsDialog" width="40%" @close="editParamsClose">
            <el-form :model="editParamsForm" :rules="editFormRule" status-icon ref="editForm">
              <el-form-item label="参数名称" prop="params_name">
                  <el-input placeholder="请输入参数名称" v-model="editParamsForm.params_name"></el-input>
              </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                 <el-button @click="editParamsDialog = false">取 消</el-button>
                <el-button type="primary" @click="editParamsSubmit">确 定</el-button>
            </div>
        </el-dialog>

</div>
</template>
<script>
import {getCategory,getParams,submitParams,deleteParams,submitEditParams} from '../../network/category.js'
export default {
name: 'params',
data () {
    return {
         paramsCateInfo:{
             type:3,
        },
        CategoryList:[],
        Keys:{
            label:'cat_name',
            value:'cat_id',
            children:'children',
            expandTrigger: 'hover'
        },
        cascaderKey:[],
        cat_id:'',
        isdisabled:true,
        activeName:'many',
        paramsData:[],
        addFormParams:{
            name:''
        },
        editParamsForm:{
            params_name:'',
            attr_id:''

        },
        addParamsDialog:false,
        editParamsDialog:false,
        addFormRule:{
            name:[{required:true,message:'请输入参数名称',trigger:'blur'},
                {max:6,message:'名称不能大于6个字符',trigger:'blur'}]
        },
        editFormRule:{
             params_name:[{required:true,message:'请输入参数名称',trigger:'blur'},
                {max:6,message:'名称不能大于6个字符',trigger:'blur'}]
        }
    }
},
created () {
    this.getParamsCate()
},
methods: {
    getParamsCate(){
        getCategory(this.paramsCateInfo).then(res=>{
            // console.log(res)
            if(res.meta.status !=200) return this.$message.err('获取分类数据失败')
            this.CategoryList = res.data
        })
    },
    CascaderChange(){
        if(this.cascaderKey.length > 2){
            this.isdisabled = false
            this.cat_id = this.cascaderKey[this.cascaderKey.length - 1]
            this.getParams()
        }else{
            this.paramsData = []
           return 
        }
    },
    handleClick(tab) {
        if(this.cascaderKey.length > 2){
       this.getParams()
        }else{
            return 
        }
      },
    getParams(){
        getParams(this.cat_id,this.activeName).then(res=>{
            if(res.meta.status !=200) return this.$message.error('获取参数失败')
            res.data.forEach(item=>{
                item.attr_vals = item.attr_vals ?item.attr_vals.split(' ') : []
                item.inputVisible = false
                item.inputValue = ''
            })
            this.paramsData = res.data 
            console.log(res.data)
            })
    },
    // 添加参数
    addParams(){
        this.addParamsDialog = true
    },
    submitParams(){
        this.$refs.addForm.validate(valid=>{
            if(!valid) return this.$message.error('请输入参数名称')
            submitParams(this.cat_id,this.addFormParams.name,this.activeName).then(res=>{
            this.getParams()
            this.$message.success('添加分类名称成功')
            this.addParamsDialog = false
        })
    })
        
    },
    // 关闭dialog 重置数据
    addParamsClose(){
        this.$refs.addForm.resetFields()
    },
    // 删除参数
    deleteParams(Info){
        console.log(Info)
         this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         deleteParams(this.cat_id,Info.attr_id).then(res=>{
            if(res.meta.status !=200) return this.$message.error('删除参数失败')
           this.getParams()
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
    editParams(paramsInfo){
        this.editParamsForm.params_name = paramsInfo.attr_name
        this.editParamsForm.attr_id = paramsInfo.attr_id
        this.editParamsDialog = true
    },
    // 提交编辑
    editParamsSubmit(){
       this.$refs.editForm.validate(valid=>{
           if(!valid) return this.$message.error('请输入编辑参数名称')
        submitEditParams(this.cat_id,this.editParamsForm.attr_id,
        this.editParamsForm.params_name,
        this.activeName).then(res=>{
            this.getParams()
            this.$message.success('编辑参数名称成功')
            this.editParamsDialog = false
        })
       })
    },
    editParamsClose(){
         this.$refs.editForm.resetFields()
    },
    // 键盘enter 鼠标失去光标 
    handleInputConfirm(row){
        // 判断输入是否为空字符串
        if(row.inputValue.trim() == 0){
            row.inputValue = ''
            row.inputVisible = false
            return 
        }
       
        row.attr_vals.push(row.inputValue.trim())
        const val = row.attr_vals.join(' ')
        submitEditParams(this.cat_id,row.attr_id,row.attr_name,this.activeName,val).then(res=>{
            if(res.meta.status !=200) return this.$message.error('添加参数失败')
            this.$message.success('添加参数成功')
            row.inputVisible = false
        })
         
      
    },
    showInput(row){
         row.inputVisible = true
         this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    tagClose(index,row){
        row.attr_vals.splice(index,1)
        submitEditParams(this.cat_id,row.attr_id,row.attr_name,this.activeName,row.attr_vals).then(res=>{
            if(res.meta.status !=200) return this.$message.error('删除参数失败')
            this.$message.success('删除参数成功')
        })
    }
}
}
</script>
<style scoped>
.casc{
    margin-top: 15px;
    font-size: 14px;
    margin-bottom: 15px
}
.el-tag{
    margin-right: 10px
}
.input-new-tag{
    width: 120px;
}
</style>