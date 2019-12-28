<template>
<div class="login">
    <div class="login_box">
        <div class="login_img">
            <img src="../assets/img/logo.png" alt="">
        </div>
        <el-form class="login_form" :model="formRule" :rules="rules" ref="from">
            <el-form-item prop="username">
                <el-input prefix-icon="iconfont icon-user " v-model="formRule.username"></el-input>
            </el-form-item>
              <el-form-item prop="password">
                <el-input prefix-icon="iconfont icon-3702mima"  v-model="formRule.password" type="password"></el-input>
            </el-form-item>
             <el-form-item>
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</div>
</template>
<script>
import {loginCheck} from '../network/login.js'
export default {
name: 'login',
data(){
    return {
        // number:123,
        // password:'zwm',
        formRule:{
            username:"admin",
            password:'123456',
        },
        rules:{
        username:[
            {required:true,message:'请输入账号',trigger:'blur'},
            {max:7,min:4,message:'请输入4-7个数字',trigger:'blur'}
        ],
        password:[
            {required:true,message:'请输入密码',trigger:'blur'},
            {max:10,min:1,message:'请输入1-10个数字',trigger:'blur'}
        ]
        }
    }
},
methods: {
    reset(){
        this.$refs.from.resetFields()
    },
    login(){
        this.$refs.from.validate(valid=>{
            if(!valid) return;
            loginCheck(this.formRule.username,this.formRule.password).then(res=>{
            if(res.meta.status !=200) return this.$message.error('登录失败！');
            this.$message.success('登录成功！');
            window.sessionStorage.setItem('token',res.data.token)
            this.$router.push('/home')
            })
        })
    }
}
}
</script>
<style scoped>
.login{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 585px;
    height: 450px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    box-shadow:2px 2px 0px rgba(0, 0, 0, .75);
   
}
.login_img{
    width: 180px;
    height: 180px;
    border: 1px solid #eee;
    border-radius: 50%;
    background-color: #fff;
    padding: 10px;
    box-shadow: 0px 0px 10px #ddd;
    position:absolute;
    left: 50%;
    transform: translate(-50%,-50%)

}
.login_img img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
}
.login_form{
    position: absolute;
    bottom:0px;
    width: 100%;
    padding: 0px 20px;
    box-sizing: border-box;
    transform: translate(0px,-50%);
    text-align: center
}
</style>