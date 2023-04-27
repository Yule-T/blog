<template>
<div class="login-body">
  <div class="login-panel">
  <div class="login-title">用户登录</div>
  <el-form :model="formData" :rules="rules" ref="formDataRef">
    <el-form-item prop="account">
      <el-input v-model="formData.account" placeholder="请输入账号" >
        <template #prefix>
          <span class="iconfont icon-account"></span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="formData.password" placeholder="请输入密码" >
        <template #prefix>
          <span class="iconfont icon-password"></span>
        </template>
      </el-input>
    </el-form-item>
    <div class="check-code-panel">
      <el-form-item prop="checkCode">
      <el-input v-model="formData.checkCode" placeholder="请输入验证码" class="input-panel" @keyup.enter="login" />
      <img :src="checkCodeUrl" class="check-code" @click="changeCheckCode" />
      </el-form-item>
    </div>
    <el-form-item label="">
      <el-checkbox v-model="formData.rememberMe" :true-label="1">记住我</el-checkbox>
    </el-form-item>
    <el-button type="primary" :style="{width:'100%'}" @click="login">登录</el-button>
  </el-form>
  </div>
</div>
</template>

<script setup>
import { getCurrentInstance, reactive,ref } from 'vue'
import md5 from 'js-md5'
import VueCookies from 'vue-cookies'
import {useRouter} from 'vue-router'

const {proxy} = getCurrentInstance();
const router = useRouter();
const formDataRef = ref();
const formData = reactive({
  account: '',
  password: '',
  checkCode:'',

});
const api={
  checkCode:"api/checkCode",
  login:'login'
}
const checkCodeUrl=ref(api.checkCode);
const changeCheckCode = ()=>{
  checkCodeUrl.value = api.checkCode + "?" + new Date().getTime();
}

const rules={
  account:[{
    required:true,
    message:"请输入用户名",
  }],
  password:[{
    required:true,
    message:"请输入密码",
  }],
  checkCode:[{
    required:true,
    message:"请输入验证码",
  }]
}

const init = ()=>{
  const loginInfo = VueCookies.get("loginInfo");
  if(!loginInfo){
    return;
  }
  Object.assign(formData,loginInfo);

  // document.onkeydown = (e)=>{
  //   if(e.keyCode!==13){
  //     return;
  //   }
  //   login();
  // }
}
init();

const login =()=>{
  formDataRef.value.validate(async(valid)=>{
    if(!valid){
      return ;
    }

    let cookiesLoginInfo = VueCookies.get("loginInfo");
    let cookiesPassword = cookiesLoginInfo ==null ? null : cookiesLoginInfo.password;
    if(formData.password !== cookiesPassword){
      formData.password = md5(formData.password);
    }

    let params={
      account :formData.account,
      password: formData.password ,
      checkCode: formData.checkCode
    }

    let result = await proxy.Request({
      url:api.login,
      params:params,
      errorCallback:()=>{
        changeCheckCode();
      }
    })
    if(!result){
      return;
    }

    proxy.Message.success("登录成功")

    setTimeout(() => {
      router.push("/");
    }, 1500);

    const loginInfo = {
      account: params.account,
      password: params.password,
      rememberMe:formData.rememberMe,
    }
    VueCookies.set("userInfo",result.data,0);
    if(formData.rememberMe==1){
      VueCookies.set("loginInfo",loginInfo,"7d");
    }
  });
}


</script>

<style scoped>
.login-body{
  width: 100%;
  height: calc(100vh);
  background-image: url("../assets/login_bg.png");
  background-size: cover;
  background-position: center;
}
.login-title{
  font-family: "微软雅黑";
  color:rgb(11, 65, 86);
  font-size: 18px;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
}
.login-panel{
  padding: 6px 20px 0 20px;
  margin-right: 100px;
  margin-top: 150px;
  border-radius: 8px;
  box-shadow: 2px 20x 10px rgba(0, 168, 252, 0.548);
  float: right;
  width: 350px;
  height: 300px;
  background-color: rgba(254, 254, 254, 0.514);
}
.check-code-panel{
  align-items: center;
  display: flex;
}
.input-panel{
  flex: 1;
  margin-right: 12px;
}
.check-code{
 cursor: pointer;
 height: 30px;
}
</style>