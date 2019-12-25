import Vue from 'vue'
import Router from 'vue-router'
const login = () => import('../components/login.vue')
const home =() => import('../view/home.vue')
const profile = ()=>import('../view/profile.vue')
Vue.use(Router)

const router = new Router({
    routes:[
        { path:'/', redirect:'/login'},
        { path:'/login', name:'login',component: login },
        { path:'/profile',component:profile},
        { path:'/home', name:'home',component:home}
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
