<template>
<el-container class="home-container">
    <!-- header -->
    <el-header>
       <div class="nav">
           <img src="../../assets/img/heima.png" alt="">
           <span>后台管理系统</span>
       </div>
        <el-button type="info" @click="back">退出</el-button>
    </el-header>
    <el-container>
        <!-- aside -->
        <el-aside :width="iscollapse? '64px' : '200px'">
            <div class="closeButton" @click="collapse">|||</div>
            <el-menu class="menu" 
            background-color="#333744"
            text-color="#fff" 
            :unique-opened="true"
            :collapse="iscollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="activePath">
              <el-submenu :index="subList.id + ''" v-for="subList in menuList" :key="subList.id">
                  <template slot="title">
                      <i :class="iconObj[subList.id]"></i>
                      <span>{{subList.authName}}</span>
                  </template>
                <el-menu-item :index="'/'+item.path" v-for="item in subList.children" :key="item.id" @click="active('/'+item.path)">
                    <template>
                        <i class="el-icon-menu"></i>
                        <span>{{item.authName}}</span>
                    </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>
        </el-aside>
        <!-- main -->
        <el-main>
           
            <router-view/>
        </el-main>
    </el-container>
</el-container>
</template>
<script>
import {getMenu} from '../../network/user.js'
export default {
name: 'Home',
data(){
    return {
        menuList:[],
        iconObj:{
            '125':'iconfont icon-user',
            '103':'iconfont icon-tijikongjian',
            '101':'iconfont icon-shangpin',
            '102':'iconfont icon-danju',
            '145':'iconfont icon-baobiao'
        },
        iscollapse:false,
        activePath:''
    }
},
created () {
  this.getMenu()
  this.activePath = window.sessionStorage.getItem('activePath')  
},
methods: {
    back(){
        window.sessionStorage.clear()
        this.$router.push('/login')
    },
    getMenu(){
        getMenu().then(res =>{
            // console.log(res.data)
            this.menuList = res.data
        })
    },
    collapse(){
        this.iscollapse = !this.iscollapse
    },
    active(activePath){
        window.sessionStorage.setItem('activePath',activePath);
        this.activePath = '/users'
    }
}
}
</script>
<style scoped>
.home-container{
    height: 100%;
}
.el-header{
    background-color:#373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0px
}
.nav{
    display: flex;
    align-items: center;
    
}
.nav span{
    padding-left: 15px;
    color: white;
    font-size: 20px
}
.el-aside{
    background-color:#333744;
}
.el-menu{
    border-right: none
}
.menu{
    background-color: #333744;
}
.closeButton{
    height: 30px;
    background-color: #373d41;
    text-align: center;
    color: white;
    letter-spacing: 0.2em;
    line-height: 20px;
    cursor: pointer;

}
.el-main{
    background-color:#eaedf1;
    overflow:auto;
    height: 100vh;
}


</style>