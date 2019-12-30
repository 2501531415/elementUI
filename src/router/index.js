import Vue from 'vue'
import Router from 'vue-router'
const login = () => import('../components/login.vue')
const home =() => import('../view/home/home.vue')
const welcome = ()=>import('../components/welcome/welcome.vue')
const user = ()=>import('../view/user/user.vue')
const rights = ()=>import('../view/rights/rights.vue')
const roles = ()=>import('../view/rights/roles.vue')
const category = ()=>import('../view/category/category.vue')
const params = ()=>import('../view/category/params.vue')
const goods = ()=>import('../view/category/goods.vue')
Vue.use(Router)

const router = new Router({
    routes:[
        { path:'/', redirect:'/login'},
        { path:'/login', name:'login',component: login },
        { path:'/home', name:'home',component:home,redirect: '/welcome',
        children:[
            {path:'/welcome',name:'welcome',component:welcome},
            {path:'/users',name:'user',component:user},
            {path:'/rights',name:'rights',component:rights},
            {path:'/roles',name:'roles',component:roles},
            {path:'/categories',name:'category',component:category},
            {path:'/params',name:'params',component:params},
            {path:'/goods',name:'goods',component:goods}
        ]
    }
    ],
    mode:'history'
})
router.beforeEach((to, from, next) => {
    if(to.path === '/login') return next();
    const token = window.sessionStorage.getItem('token')
    if(!token) return next('/login');
    next()
})
export default router
