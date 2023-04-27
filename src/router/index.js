import { createRouter ,createWebHistory} from "vue-router";
import VueCookies from 'vue-cookies'

const routes = [
    // {
    //     path:'/',
    //     redirect:'/login',
    // },
    {
        name: '首页',
        path: '/login',
        component: () => import('../views/Login.vue'),
    },
    {
        name: '框架页',
        path: '/',
        component: () => import('../views/Framework.vue'),
        redirect:'/blog/list',
        children: [
            {
                path: '/blog/test',
                name: '测试',
                component: () => import('../views/blog/Test.vue')
            },
            {
                path: '/blog/list',
                name: '博客管理',
                component: () => import('../views/blog/BlogList.vue')
            },
            {
                path: '/blog/category',
                name: '分类管理',
                component: () => import('../views/blog/BlogCategory.vue')
            },
        ],
    },
];

const router = createRouter({
    routes,
    history: createWebHistory(),
})

router.beforeEach((to,from,next) =>{
    const userInfo = VueCookies.get("userInfo");
    if(!userInfo && to.path != "/login"){
        router.push("/login");
    }
    next();
})

export default router