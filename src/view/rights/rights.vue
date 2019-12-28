<template>
<div class="right">
    <el-breadcrumb>
        <el-breadcrumb-item :to="{path:'/welcome'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>    
    <el-card>
        <el-table :data="rightsList" border stripe >
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
                <template slot-scope="scope"> 
                    <el-tag type="success" v-if="scope.row.level === '0'">等级一</el-tag>
                    <el-tag type="warning" v-else-if="scope.row.level === '1'">等级二</el-tag>
                    <el-tag type="danger" v-else>等级三</el-tag>
                </template>
               
            </el-table-column>

        </el-table>
    </el-card>

</div>
</template>
<script>
import {getRights} from '../../network/rights.js'
export default {
name: 'rights',
data () {
    return {
        type:'list',
        rightsList:[]
    }
},
created () {
    this.getRights(this.type)
},
methods: {
    getRights(type){
        getRights(type).then(res=>{
            if(res.meta.status !=200){
                return this.$message.error('获取权限列表失败')
            }
        console.log(res)
        this.rightsList = res.data
        })
    }
}
}
</script>
<style scoped>
.right{
    height: 100%;
}
</style>