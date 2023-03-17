<template>
<div class="login-body">
  <div class="login-panel">
    <div>jjh</div>
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
      <el-input v-model="formData.password" placeholder="请输入密码" >
        <template #prefix>
          <span class="iconfont icon-password"></span>
        </template>
      </el-input>
    </el-form-item>
    <div class="check-code-panel">
      <el-form-item prop="checkCode">
      <el-input v-model="formData.checkCode" placeholder="请输入验证码" class="input-panel" />
      <img :src="checkCodeUrl" class="check-code" @click="changeCheckCode" />
      </el-form-item>
    </div>
    <el-form-item label="">
      <el-checkbox v-model="formData.rememberMe" :label="true">记住我</el-checkbox>
    </el-form-item>
    <el-button type="primary" :style="{width:'100%'}" @click="login">登录</el-button>
  </el-form>
  </div>
</div>
</template>

<script setup>
import { reactive,ref } from 'vue'


const formDataRef = ref();
const formData = reactive({
  account: '',
  password: '',
  checkCode:'',

});
const api={
  checkCode:"api/checkCode"
}
const checkCodeUrl=ref(api.checkCode);
const changeCheckCode = ()=>{
  checkCodeUrl.value = api.checkCode + new Date().getTime();
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

const login =()=>{
  formDataRef.value.validate((valid)=>{
    if(!valid){
      return ;
    }
  });
}


</script>

<style scoped>
.login-body{
  width: 100%;
  height: calc(100vh);
  background-size: cover;
  background-position: center;
  background-image: url("../assets/login_bg.png");
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
  margin-top: 100px;
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