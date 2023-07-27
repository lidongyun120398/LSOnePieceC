<template>
  <div class="login">
    <div class="login-pane">
      <span>LOGIN</span>
      <div class="login-box">
        <el-form ref="formRef" :model="loginForm">
          <el-form-item prop="name">
            <el-input v-model="loginForm.loginName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" show-password placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-button class="login-btn" @click="handleSumbit">登录</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { getUserInfo } from "@/service/main/user";

const loginForm = reactive({
  loginName: "",
  password: "",
});

const router = useRouter();
const handleSumbit = async () => {
  try {
    let res = await getUserInfo("/user/login");
    if (res.code === 0) {
      router.push("/home");
    }
  } catch (error) {
    throw new Error("登录错误");
  }
};
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_1280.jpg") no-repeat;
  background-size: 100% 100%;
  .login-pane {
    width: 400px;
    height: 300px;
    // border: 1px solid #000;
    border-radius: 15px;
    background-color: #fff;
    opacity: 0.5;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    span {
      font-size: 30px;
      font-weight: 700;
    }
  }
  .login-box {
    width: 70%;
    height: 30%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
      border-bottom: 1px solid #8a8a8a;
      border-radius: 0;
    }
  }
  .login-btn {
    color: #fff;
    width: 70%;
    height: 15%;
    background-image: linear-gradient(to right, #30cfd0, #330867);
  }
}
</style>
