<template>
<div class="catecory">
     <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>分类管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
         <el-row :gutter="20">
          <el-col>
              <el-button type="primary" @click="addCategory">添加分类</el-button>
          </el-col>
        </el-row>
        <tree-table :data="categoryList" :columns="column" 
        :expand-type="false" 
        :selection-type="false" 
        index-text="#" 
        :show-index="true"
        class="tree-table">
            <template slot="isok" slot-scope="scope">
                <i class="el-icon-success" style="color:green" v-if="scope.row.cat_deleted == false"></i>
                <i class="el-icon-error" style="color:red" v-else></i>
            </template>
            <template slot="level" slot-scope="scope">
                <el-tag type="success" v-if="scope.row.cat_level == 0">一级</el-tag>
                <el-tag type="success" v-else-if="scope.row.cat_level == 1">二级</el-tag>
                <el-tag type="success" v-else>三级</el-tag>
            </template>
            <template slot="control" slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="editCate(scope.row)"></el-button>
                <el-button type="warning" icon="el-icon-delete" @click="delCate(scope.row)"></el-button>
            </template>
        </tree-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="categoryInfo.pagenum"
      :page-sizes="[1, 3, 5, 7]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
        
    </el-card>
        <el-dialog title="添加分类" :visible.sync="categoryDialog" width="40%" @close="addCateClose">
            <el-form :model="addCateForm" :rules="addFormRule" status-icon ref="addForm">
              <el-form-item label="分类名称" prop="cat_name">
                  <el-input placeholder="请输入分类名称" v-model="addCateForm.cat_name"></el-input>
              </el-form-item>
              <el-form-item  label="父级分类">
                  <el-cascader :options="addCategoryKeys" v-model="addCateValue" :props="selectKeys" 
                  @change="cascaderChange"
                   change-on-select clearable>
                  </el-cascader>
              </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                 <el-button @click="categoryDialog = false">取 消</el-button>
                <el-button type="primary" @click="cateSubmit">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑dialog -->
        <el-dialog title="编辑分类" :visible.sync="editCategoryDialog" width="40%" @close="editCateClose">
            <el-form :model="editCateForm" :rules="editFormRule" status-icon ref="editForm">
              <el-form-item label="分类名称" prop="cat_name">
                  <el-input placeholder="请输入分类名称" v-model="editCateForm.cat_name"></el-input>
              </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                 <el-button @click="editCategoryDialog = false">取 消</el-button>
                <el-button type="primary" @click="editcateSubmit">确 定</el-button>
            </div>
        </el-dialog>

</div>
</template>
<script>
import {getCategory,cateSubmit,delCate,editCate} from '../../network/category.js'
export default {
name: 'catecory',
data () {
    return {
        categoryInfo:{
            type:3,
            pagenum:1,
            pagesize:5
        },
        total:0,
        categoryList:[],
         addCateValue:[],
         editCateForm:{
             cat_name:'',
             cat_id:'',
         },
        addCateForm:{
            cat_name:'',
            cat_pid:'',
            cat_level:''

        },
        addCategoryKeys:[],
        categoryDialog:false,
        editCategoryDialog:false,
        column:[
            {label:'分类名称',prop:'cat_name'},
            {type:'template',template:'isok',label:'分类安全',prop:'cat_deleted'},
            {type:'template',template:'level',label:'分类等级',prop:'cat_level'},
            {label:'操作',type:'template',template:'control'}
        ],
        selectKeys:{
            value:'cat_id',
            label:'cat_name',
            children:'children',
            expandTrigger: 'hover'
        },
        addCateInfo:{
             type:2,
            pagenum:2,
            pagesize:5
        },
        addFormRule:{
            cat_name:[
                {required:true,message:'请输入分类名称',trigger:'blur'},
                {max:6,message:'名称不能大于6个字符',trigger:'blur'}
            ]
        },
        editFormRule:{
            cat_name:[
                {required:true,message:'请输入分类名称',trigger:'blur'},
                {max:6,message:'名称不能大于6个字符',trigger:'blur'}
            ]
        }
       
    }
},
created () {
    this.getCategory()
},
methods: {
    // 获取分类列表
    getCategory(){
        getCategory(this.categoryInfo).then(res=>{
           if(res.meta.status !=200){
               return this.$message.error('获取分类列表数据失败')
           }
               this.total = res.data.total
               this.categoryList = res.data.result
           
        })
    },
    // 一页显示多少条
    handleSizeChange(val){
            this.categoryInfo.pagesize = val
            this.getCategory()
    },
    // 当前页码
    handleCurrentChange(val){
       this.categoryInfo.pagenum = val
       this.getCategory()
    },
    // 添加分类
    addCategory(){
        getCategory(this.addCategory).then(res=>{
            console.log(res)
            if(res.meta.status !=200){
                return this.$message.error('获取父级数据失败')
            }
            this. addCategoryKeys = res.data
            this.categoryDialog = true

        })
    },
    // 监听连级变化
    cascaderChange(){
        if(this.addCateValue.length>0){
            this.addCateForm.cat_pid = this.addCateValue[this.addCateValue.length - 1]
            this.addCateForm.cat_level = this.addCateValue.length
        }else{
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0
        }
        return 
    },
    // 提交添加分类
    cateSubmit(){
      this.$refs.addForm.validate(valid=>{
          if(!valid) return this.$message.error('请输入内容！')
            cateSubmit(this.addCateForm).then(res=>{
            this.categoryDialog = false 
            this.getCategory()
        })
      })
    },
    // 表单关闭重置
    addCateClose(){
        this.$refs.addForm.resetFields()
        this.addCateValue = [],
        this.addCateForm.cat_name = ''
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
    },
    // 删除分类
    delCate(cateInfo){
       this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delCate(cateInfo.cat_id).then(res=>{
            if(res.meta.status !=200) return this.$message.error('删除分类失败')
            this.getCategory()
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
    // 分类编辑
    editCate(cateInfo){
       this.editCategoryDialog = true
       this.editCateForm.cat_id = cateInfo.cat_id
    },
    editcateSubmit(){
        this.$refs.editForm.validate(valid=>{
            if(!valid) return this.$message.error('请填写编辑名称')
            editCate(this.editCateForm).then(res=>{
                if(res.meta.status !=200) return this.$message.errot('编辑名称失败')
                 this.getCategory()
                 this.$message.success('编辑分类名称成功')
                  this.editCategoryDialog = false
            })  
        })
    
    },
    // 关闭编辑表单重置数据
    editCateClose(){
        this.$refs.editForm.resetFields()
        this.editCateForm.cat_id = ''
    }
}
}
</script>
<style scoped>
.tree-table{
    margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>