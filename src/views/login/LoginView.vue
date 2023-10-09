<template>
  <div class="login-page">
    <div class="logo">
      <img src="@/assets/logo.svg" alt="Logo" height="40" />
    </div>
    <van-form @submit="login" autocomplete="off" validateTrigger="onSubmit">
      <van-cell-group class="form-group">
        <van-field v-model="form.username" label="账号" placeholder="请输入用户名/邮箱" clearable type="text" :rules="formRules.usernmae"></van-field>
        <van-field v-model="form.password" label="密码" placeholder="请输入密码" clearable type="password" :rules="formRules.password"></van-field>
        <van-field v-model="form.verificationCode" label="验证码" placeholder="请输入验证码" :rules="formRules.verificationCode">
          <template #extra>
            <CaptchaView ref="captchaRef" v-model:CaptchaToken="form.verificationCodeToken" />
          </template>
        </van-field>
      </van-cell-group>
      <van-button class="mt10" type="primary" block native-type="submit">登录</van-button>
    </van-form>
    <p class="register-link">没有账号？<router-link to="/register">立即注册</router-link></p>
  </div>
</template>

<script setup lang="ts">
import CaptchaView from "@/components/captcha/CaptchaView.vue";
import { Local } from "/@/utils/storage";
import RequestToast from "/@/utils/tips/RequestToast";
const router = useRouter();
const captchaRef = ref();
const form = reactive({
  username: '',
  password: '',
  verificationCode: '',
  verificationCodeToken: '',
});
const formRules = {
  usernmae: [
    { required: true, message: '请输入账号', }
  ],
  password: [
    { required: true, message: '请输入密码', },
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', },
  ],
}
const userLoginToast = new RequestToast(userLogin);
// userLoginToast.successMessage="登录成功";
const login = () => {
  // 在这里进行登录逻辑处理
  const data = {
    username: form.username,
    password: form.password,
    verifyCode: form.verificationCode,
    verifyCodeToken: form.verificationCodeToken
  }

  userLoginToast.sendRequest(data).then(res => {
    Local.setString("token", res.data.token)
    userLoginToast.push("/")
  }).catch(() => {
    captchaRef.value.getVerificationCode();
  })

};
</script>

<style lang="scss" scoped>
.login-page {
  padding: 10px;
}

.logo {
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  width: 100%;
  /* max-width: 300px; */
}


.register-link {
  margin-top: 20px;
  text-align: center;
}

.register-link a {
  color: #1989fa;
}
</style>