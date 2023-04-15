<template>
  <div class="layout">
    <el-container>
      <el-header class="header">
        <img src="/src/assets/logo.png" alt="这是俺的博客呀" class="imgLogo">
        <div class="user-info">
          <span style="color:#  color: #f1f5fb;">欢迎回来，</span> 
          <el-dropdown trigger="click">
            <span class="nick-name">
              {{userInfo.nickName}}
              <span class="iconfont icon-close"></span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div class="avatar"><img :src="userInfo.avatar" alt=""></div>
        </div> 
      </el-header>
      
      <el-container class="container">
        <el-aside width="200px" class="left-aside">
          <div>
            <el-button type="primary" class="post-btn">发布</el-button>
          </div>
          <div class="menu-panel">
            <ul>
              <li v-for="(menu,index) in menuList" :key="menu">
                <span class="menu-title-p" @click="openClose(index)">
                  <span :class="['iconfont',menu.icon]"></span>
                  <span class="menu-title">{{menu.title}}</span>
                  <span :class="['iconfont','open-close',menu.open?'icon-open':'icon-close']"></span>
                </span>
                <ul class="sub-menu" v-show="menu.open">
                  <li v-for="subMebu in menu.children" :key="subMebu">
                    <router-link :to="subMebu.path" 
                                  :class="['sub-menu-item',activePath==subMebu.path?'active':'']">
                      {{subMebu.title}}
                    </router-link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </el-aside>
        <el-main class="right-main">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script setup>
import { getCurrentInstance, reactive,ref, watch } from 'vue'
import VueCookies from 'vue-cookies'
import {useRouter,useRoute} from "vue-router"

const router=useRouter();
const route=useRoute();
const {proxy} = getCurrentInstance();
const menuList = ref([
  {
    title:"博客",
    icon:"icon-blog",
    open:true,
    children:[
      {
        title:"博客管理",
        path:"/blog/list",
      },
      {
        title:"分类管理",
        path:"/blog/category",
      },
    ],
  },
  {
    title:"专题",
    icon:"icon-zhuanti",
    open:true,
    children:[
      {
        title:"专题管理",
        path:"/special/category",
      },
    ],
  },
  {
    title:"设置",
    icon:"icon-setting",
    open:true,
    children:[
      {
        title:"个人信息管理",
        path:"/setting/my",
      },
      {
        title:"博客成员",
        path:"/setting/user",
      },
      {
        title:"系统设置",
        path:"/setting/sysSetting",
        roleType:1,
      },
    ],
  },
  {
    title:"回收站",
    icon:"icon-delete",
    open:true,
    children:[
      {
        title:"回收站",
        path:"/recovery/list",
      },
    ],
  },
])

const openClose =(index) =>{
  const open= menuList.value[index].open;
  menuList.value[index].open=!open;
}

const userInfo=ref({});

const init = () => {
  userInfo.value = VueCookies.get("userInfo");
  userInfo.value.avatar = proxy.globalInfo.imageUrl + userInfo.value.avatar;
}
init();

const activePath = ref(null);
watch(route,(newVal,oldVal) => {
  activePath.value = newVal.path;
}, {immediate: true, deep: true});

</script>

<style scoped>
.layout{
  height: calc(100vh);
  width: 100%;
  font-family: "微软雅黑";
    /* background-image: url("../assets/vue-bg1.png"); */
    background-repeat:no-repeat;
    background-size:cover;
}
.header{
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.container{
  background-color: rgba(241, 244, 248, 0.678);
  height: calc(100vh - 60px);
}
.left-aside{
  padding: 10px;
  width: 260px;
  border-right: 1px solid rgb(255, 255, 255);
}
.right-main{
  background-color: rgba(249, 245, 252, 0.507);
}
.post-btn{
  width: 100%;
  height: 40px;
  border-radius: 6px;
}
.menu-panel{
  margin-top: 5px;
}
.menu-panel ul{
  padding: 0;
  margin: 0;
}
.menu-panel ul li{
  padding: 0;
  margin: 0;
  list-style: none;
}
.menu-title-p{
  padding: 0 5px;
  line-height: 40px;
  cursor: pointer;
  display: flex;
}
.menu-title-p:hover{
  background: rgba(88, 82, 97, 0.123);
  border-radius: 4px;
}
.iconfont{
  font-size: 16px;
  color: rgb(94, 108, 124);
}
.menu-title{
  flex: 1;
  color: rgb(79, 88, 108);
  margin-left: 10px;
}
.open-close{
  width: 20px;
  font-size: 14px;
}
.menu-panel .sub-menu{
  font-size: 14px;
}
.sub-menu-item{
  padding: 0 32px;
  display: block;
  text-decoration: none;
  color: rgb(44, 47, 52);;
  cursor: pointer;
  line-height: 40px;
}
.sub-menu-item:hover{
  background: rgba(88, 82, 97, 0.123);
  border-radius: 4px;
}
.imgLogo{
  height: 90%;
}
.user-info{
  display: flex;
  align-items: center;
}
.nick-name{
  cursor: pointer;
  font-size: 16px;
  color: #e9f1fe;
}
.icon-close{
  font-size: 14px;
}
.avatar{
  margin-left: 10px;
  width:50px
}
.avatar img{
  border-radius: 25px;
  width: 100%;
}
.sub-menu .active{
  background: rgba(88, 82, 97, 0.123);
  border-radius: 4px;
  color: #6c93f4;
}
</style>