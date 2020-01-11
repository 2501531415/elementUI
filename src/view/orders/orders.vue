<template>
<div class="orders">
    <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-row>
          <el-col :span="8">
        <el-input v-model="orderInfo.query" clearable @clear="searchClear">
            <el-button type="primary" slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
          </el-col>
        </el-row>
        <el-table :data="orderList" border >
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="订单编号" prop="order_number" width="300px"></el-table-column>
          <el-table-column label="订单价格" prop="order_price"></el-table-column>
          <el-table-column label="是否支付">
              <template slot-scope="scope"> 
                  <el-tag type="danger" v-if="scope.row.pay_status == 0">未支付</el-tag>
              </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send"></el-table-column>
          <el-table-column label="下单时间">
              <template slot-scope="scope">
                  <span>{{scope.row.create_time | showTime}}</span>
              </template>
          </el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="editAddress"></el-button>
                <el-button type="success" icon="el-icon-location" @click="message"></el-button>
              </template>
          </el-table-column>
        </el-table>
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="orderInfo.pagenum"
      :page-sizes="[1, 5, 10, 15]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 修改dialog -->
    <el-dialog title="修改地址" :visible.sync="editOrderDialog" @close="editDialogClose">
        <el-form :model="editAddress1" :rules="editRules" ref="editForm">
          <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="citydata" v-model="editAddress1.address1" :props="keys"></el-cascader>
          </el-form-item>
        <el-form-item label="详细地址" prop="address2">
            <el-input v-model="editAddress1.address2"></el-input>
        </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
                 <el-button @click="editOrderDialog = false">取 消</el-button>
                <el-button type="primary" @click="editOrderDialog = false">确 定</el-button>
        </div>
    </el-dialog>
    <!--查看物流信息 timeline -->
    <el-dialog title="查看物流信息" :visible.sync="messageDialog">
    <el-timeline>
        <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :timestamp="activity.time">
         {{activity.context}}
        </el-timeline-item>
  </el-timeline>
    </el-dialog>
    
</div>
</template>
<script>
import citydata from '../../common/citydata.js'
import {formatDate} from '../../common/utils.js'
import {getOrderList,getMessage} from '../../network/orders.js'
export default {
name: 'orders',
data () {
    return {
        orderInfo:{
            query:'',
            pagenum:1,
            pagesize:5,
        },
        orderList:[],
        total:null,
        citydata,
        keys:{
            children:'children'
        },
        editOrderDialog:false,
        messageDialog:false,
        editAddress1:{
            address1:[],
            address2:''
        },
        activities:[],
        editRules:{
            address1:[{required:true,message:'请输入省市区/县',trigger:'blur'}],
            address2:[{required:true,message:'请输入详细地址',trigger:'blur'}]
        }
    }
},
created () {
    this.getOrderList()   
},
methods: {
    getOrderList(){
        getOrderList(this.orderInfo).then(res=>{
            if(res.meta.status !=200) return this.$message.error('获取订单列表失败！')
            this.orderList = res.data.goods
            this.total = res.data.total
        })
    },
    search(){
        this.getOrderList()
    },
    searchClear(){
        this.getOrderList()
    },
    handleSizeChange(val){
        this.orderInfo.pagesize = val
        this.getOrderList()
    },
    handleCurrentChange(val){
        this.orderInfo.pagenum = val
        this.getOrderList()  
    },
    //修改地址
    editAddress(){
        this.editOrderDialog = true
    },
    editDialogClose(){
        this.$refs.editForm.resetFields()
    },
    // 查看物流信息
    message(){
        this.messageDialog = true
        getMessage().then(res=>{
            if(res.meta.status !=200) return this.$message.error('获取物流信息失败！')
            this.activities = res.data
        })
    }
},
filters: {
    showTime(value){
        const date = new Date(value *1000)
        return  formatDate(date,'yyyy-mm-dd')
    }
}
}
</script>
<style scoped>
.el-cascader{
    width: 100%
}
</style>