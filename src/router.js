import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import wlcome from './components/Wlcome.vue'
import Users from './components/Users.vue'
import roles from './components/roles.vue'
import rights from './components/Rights.vue'
import Cate from './components/goods/Cate.vue'
import params from './components/goods/params.vue'
import goods from './components/goods/goods.vue'
import Add from './components/goods/Add.vue'
import Order from './components/order/Order.vue'
import Reports from './components/Reports/Reports.vue'
Vue.use(Router)
    // 路由规则
const router = new Router({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        {
            path: '/home',
            component: Home,
            redirect: '/wlcome',
            children: [
                { path: '/wlcome', component: wlcome },
                { path: '/users', component: Users },
                { path: '/roles', component: roles },
                { path: '/rights', component: rights },
                { path: '/categories', component: Cate },
                { path: '/params', component: params },
                { path: '/goods', component: goods },
                { path: '/goods/Add', component: Add },
                { path: '/orders', component: Order },
                { path: '/reports', component: Reports }

            ]
        }
    ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数，表示放行
    //     next()  放行    next('/login')  强制跳转

    if (to.path === '/login') return next()
        // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router