<template>
<div class="goods">
     <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>分类管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
</div>
</template>
<script>
export default {
name: 'goods'
}
</script>
<style scoped>

</style>