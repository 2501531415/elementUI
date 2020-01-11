<template>
<div class="goods">
     <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
        <el-row>
          <el-col :span="8" class="btns">
        <el-input  placeholder="请输入内容" v-model="goodsInfo.query" clearable @clear="clearSearch">
            <el-button  slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
          </el-col>
          <el-col :span="2">
              <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-col>
        </el-row>
        <el-table :data="goodsList" border >
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="商品名称" prop="goods_name" width="700px"></el-table-column>
          <el-table-column label="商品价格(元)" prop="goods_price"></el-table-column>
          <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
          <el-table-column label="创建时间">
              <template slot-scope="scope">
                <span>{{scope.row.add_time | showDate}}</span>
              </template>
          </el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit"></el-button>
                  <el-button type="danger" icon="el-icon-delete" @click="removegoods(scope.row)"></el-button>
              </template>
          </el-table-column>
        </el-table>
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsInfo.pagenum"
      :page-sizes="[1, 3, 5, 7]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
</div>
</template>
<script>
import {formatDate} from '../../../common/utils.js'
import {getGoods,removeGoods} from '../../../network/category.js'
export default {
name: 'goods',
data () {
    return {
        goodsInfo:{
            query:'',
            pagenum:1,
            pagesize:5
        },
        goodsList:[],
        total:null,
    }
},
created () {
    this.getGoods()
},
filters: {
    showDate(value){
        const date = new Date(value *1000)
        return formatDate(date,'yyyy-MM-dd')
    }
},
methods: {
    // 获取商品列表
    getGoods(){
        console.log(this.goodsInfo)
        getGoods(this.goodsInfo).then(res=>{
            console.log(res)
            if(res.meta.status !=200) return this.$message.error('获取商品列表失败！')
            this.goodsList = res.data.goods
            this.total = res.data.total
        })
    },
    // 分页
    handleSizeChange(val){
        this.goodsInfo.pagesize = val
         this.getGoods()
    },
    handleCurrentChange(val){
        this.goodsInfo.pagenum = val
         this.getGoods()
    },
    // 搜索
    search(){
         this.getGoods()
    },
    clearSearch(){
        this.getGoods()
    },
    // 添加商品
    addGoods(){
        this.$router.push('/goods/addGoods')
    },
    // 删除商品
    removegoods(info){
            console.log(info)
             this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           removeGoods(info.goods_id).then(res=>{
           if(res.meta.status !=200) return this.$message.error('删除商品失败！')
            this.getGoods()
            this.$message({
            type: 'success',
            message:'删除商品成功'
          })     
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
}
}

</script>
<style scoped>
.btns{
    margin-right: 10px
}
</style>