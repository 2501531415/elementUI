<template>
<div class="addGoods">
     <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
    <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
        <el-steps :active="tabActive - 0" finish-status="success" process-status="wait">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
    </el-steps>
    <el-form :model="addGoodsForm" :rules="addFormRule" status_icon ref="addForm">
    <el-tabs :tab-position="tabPosition" style="height:100%" v-model="tabActive" @tab-click="tabChange" :before-leave="change">
        <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="addGoodsForm.goods_name" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                  <el-input v-model.number="addGoodsForm.goods_price" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                  <el-input v-model.number="addGoodsForm.goods_weight" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                  <el-input v-model.number="addGoodsForm.goods_number" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="商品分类">
                  <el-cascader :options="categoryList" v-model="addGoodsForm.goods_cat" :props="Keys" @change="cascChange" clearable></el-cascader>
              </el-form-item>   
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyParamsData" :key="item.attr_id">
                <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox :label="item1" v-for="(item1,index) in item.attr_vals" :key="index" border></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyParamsData" :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
            <el-upload
                :action="uploadUrl"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture" :headers="headersObj" :on-success="upLoadSuccess">
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btns" @click="addGoods">添加商品</el-button>
        </el-tab-pane>
    </el-tabs>
    </el-form>
    </el-card>
    <!-- 图片预览dialog -->
    <el-dialog title="图片预览" :visible.sync="proviewDialog" width="50%" @close="previewClose">
        <img :src="previewPath" alt="">
    </el-dialog>
</div>
</template>
<script>
import _ from 'lodash'
import {getCategory,getParams,addGoods} from '../../../network/category.js'
export default {
name: 'addGoods',
data () {
    return {
        tabActive:'0',
        tabPosition:'left',
        cat_id:'',
         addGoodsForm:{
            goods_name:'',
            goods_cat:[],
            goods_price:0,
            goods_number:0,
            goods_weight:0,
            goods_introduce:'',
            pics:[],
            attrs:[]
        },
        previewPath:'',
        proviewDialog:false,
        selectLength:'',
        categoryList:[],
        manyParamsData:[],
        onlyParamsData:[],
        categoryInfo:{
            type:3
        },
        Keys:{
            label:'cat_name',
            value:'cat_id',
            children:'children',
            expandTrigger: 'hover'
        },
        uploadUrl:'http://127.0.0.1:8888/api/private/v1/upload',
        headersObj:{
            Authorization:window.sessionStorage.getItem('token')
        },
        addFormRule:{
            goods_name:[
                {required:true,message:'请输入商品名称',trigger:'blur'},
            ],
            goods_price:[
                {required:true,message:'请输入商品价格',trigger:'blur'},
            ],
            goods_weight:[
                {required:true,message:'请输入商品重量',trigger:'blur'},
            ],
            goods_number:[
                {required:true,message:'请输入商品数量',trigger:'blur'},
            ],
            goods_introduce:[
                {required:true,message:'请输入商品介绍',trigger:'blur'},
            ],
        },
    }
},
created () {
    this.getCategory()
},
methods: {
    getCategory(){
        getCategory(this.categoryInfo).then(res=>{
            if(res.meta.status !=200) return this.$message.err('获取分类数据失败')
            this.categoryList = res.data
        })
    },
    // 级联的变化
    cascChange(){
        if(this.addGoodsForm.goods_cat.length>2){
            this.selectLength = this.addGoodsForm.goods_cat.length
            this.cat_id = this.addGoodsForm.goods_cat[this.addGoodsForm.goods_cat.length - 1]
        }else{
            this.selectLength = 0
        }
    },
    // 选项卡变化
    tabChange(){        
      if(this.tabActive === '1'){
           getParams(this.cat_id,'many').then(res=>{
            res.data.forEach(item=>{
                item.attr_vals = item.attr_vals ?item.attr_vals.split(' ') : []
            })
           this.manyParamsData = res.data
       })
      }else if(this.tabActive === '2'){
           getParams(this.cat_id,'only').then(res=>{
           this.onlyParamsData = res.data
       })
      }
       
    },
    change(newName,oldname){
       if(oldname = "0" && this.selectLength != 3){
           this.$message.error('请选择分类')
           return false
       }
    },
    // 预览图片
    handlePreview(file) {
        console.log(file)
        this.previewPath = file.response.data.url
        this.proviewDialog = true
      },
    previewClose(){
        this.previewPath = ''
    },
    handleRemove(file) {
       const path = file.response.data.tem_path
       const i=this.addGoodsForm.pics.findIndex(x=>{
           x.pic == path
       })
        this.addGoodsForm.pics.splice(i,1)
        console.log(this.addGoodsForm.pics)
      },
    // 上传成功之后的操作
    upLoadSuccess(response){ 
        const pathPic = {
            pic:response.data.tmp_path
        }
        this.addGoodsForm.pics.push(pathPic)
    },
    // 添加商品
    addGoods(){
        this.$refs.addForm.validate(valid=>{
            if(!valid) return this.$message.error('请填写必要的选项')
            const form =_.cloneDeep(this.addGoodsForm)
            form.goods_cat = form.goods_cat.join(',')
            // 处理attr

            this.manyParamsData.forEach(item=>{
                const Info = {
                    attr_id:item.attr_id,
                    attr_value:item.attr_vals.join(' ')
                }
                this.addGoodsForm.attrs.push(Info)
            })

            this.onlyParamsData.forEach(item=>{
                const Info = {
                    attr_id:item.attr_id,
                    attr_value:item.attr_vals
                }
                this.addGoodsForm.attrs.push(Info)
            })
            form.attrs = this.addGoodsForm.attrs
            console.log(form)
            addGoods(form).then(res=>{
                if(res.meta.status !=201) return this.$message.error('添加商品失败！')
                this.$message.success('添加商品成功！')
                this.$router.push('/goods')
            })
        })
    }

}
}
</script>
<style scoped>
.el-steps{
    margin: 15px 50px 
}
.btns{
    margin-top: 15px
}
</style>