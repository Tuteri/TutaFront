<template>
  <div class="register-page">
    <van-form autocomplete="off" @submit="onSubmit" validateTrigger="onSubmit" ref="formRef">
      <template v-if="activeStep === 0">
        <van-cell-group>
          <van-field v-model="form.email" label="Email" name="email" clearable placeholder="请输入邮箱" :rules="formRules.email"></van-field>
          <van-field v-model="form.emailCode" label="邮箱验证码" name="emailCode" clearable center :rules="formRules.emailCode" placeholder="请输入邮箱验证码">
            <template #button>
              <van-button size="small" type="primary" v-hf @click="sendEmailCode">
                {{ sendEmailStatus ? "重新发送 " + nextSendTime + "秒" : "发送验证码" }}
              </van-button>
            </template>
          </van-field>
        </van-cell-group>
        <van-button class="mt10" block type="primary" native-type="submit">下一步</van-button>
      </template>
      <template v-else-if="activeStep === 1">
        <van-cell-group>
          <van-field v-model="form.username" :rules="formRules.username" label="用户名" placeholder="请输入用户名"></van-field>
          <van-field v-model="form.password" :rules="formRules.password" label="密码" placeholder="请输入密码" type="password"></van-field>
          <van-field v-model="form.password2" :rules="formRules.password2" label="确认密码" placeholder="请再次输入密码" type="password"></van-field>
          <van-field v-model="form.verificationCode" :rules="formRules.verificationCode" clearable label="验证码" placeholder="请输入验证码">
            <template #extra>
              <CaptchaView ref="captchaRef" v-model:CaptchaToken="form.verificationCodeToken" />
            </template>
          </van-field>
        </van-cell-group>
        <van-button class="mt10" block type="primary" native-type="submit">注册</van-button>
        <van-button class="mt10" block type="default" @click="backStep1()">返回上一步</van-button>
      </template>
    </van-form>
    <p class="register-link">已有账号<router-link to="/login">去登录</router-link></p>
  </div>
</template>

<script lang="ts" setup>
import { FormInstance } from 'vant';
import CaptchaView from '/@/components/captcha/CaptchaView.vue';
import Validator from '/@/utils/Validator';
import { Local } from '/@/utils/storage';
import RequestToast from '@/utils/tips/RequestToast'
const router = useRouter();
const captchaRef = ref();
const formRef = ref<FormInstance>();
const form = reactive({
  email: '',
  username: '',
  password: '',
  password2: '',
  emailCode: '',
  emailToken: '',
  verificationCode: '',
  verificationCodeToken: '',
});

const formRules = {
  email: [
    { required: true, message: "请输入有效的电子邮件地址" },
    { pattern: Validator.email, message: "请输入有效的电子邮件地址" }
  ],
  username: [
    { required: true, message: "请输入用户名" },
    { pattern: Validator.username, message: "用户名格式任意字母、_（下划线）、数字，5-16位" }
  ],
  password: [
    { required: true, message: "请输入密码" },
    { pattern: Validator.password, message: "密码格式任意字母、数字，6-15位" }
  ],
  password2: [
    { required: true, message: "请再次输入密码" },
    {
      validator: (value: string) => value === form.password,
      message: "两次输入密码不一致",
    }
  ],
  verificationCode: [
    { required: true, message: "请输入验证码" }
  ],
  emailCode: [
    { required: true, message: "请输入邮箱验证码" }
  ]
}

const activeStep = ref(0);
const sendEmailStatus = ref(false);
const nextSendTime = ref(60);
let timer: any = null;

const sendEmailToast = new RequestToast(emailRegiserSendCode);
sendEmailToast.loadingMessage = "正在发送中";
sendEmailToast.successMessage = "发送成功";
// 发送邮箱验证码 
const sendEmailCode = async () => {
  if (sendEmailStatus.value) return false;
  await formRef.value?.validate("email").then(() => {
    sendEmailToast.sendRequest(form.email).then(res => {
      sendEmailStatus.value = true;
      form.emailToken = res.data.token;
      clearInterval(timer);
      timer = setInterval(() => {
        if (nextSendTime.value-- == 1) {
          sendEmailStatus.value = false;
        } else if (nextSendTime.value == 0) {
          nextSendTime.value = 60;
          clearInterval(timer);
        }
      }, 1000)
    }).catch((res) => {
      sendEmailStatus.value = false;
      clearInterval(timer);
    })
  }).catch(() => {
  })
};

const verifyEmailToast = new RequestToast(emailRegiserVerifyCode);
verifyEmailToast.successToast = false;
const verifyEmail = () => {
  // 在这里进行邮箱验证的逻辑处理
  verifyEmailToast.sendRequest({ email: form.email, token: form.emailToken, emailCode: form.emailCode }).then(res => {
    verifyEmailToast.closeRequestToast();
    activeStep.value = 1;
  })
};
// 返回步骤1
const backStep1 = () => {
  clearInterval(timer);
  nextSendTime.value = 60;
  sendEmailStatus.value = false;
  activeStep.value = 0;
  form.emailCode = '';
  form.emailToken = '';
}

const registerToast = new RequestToast(userRegister);
registerToast.successMessage = "注册成功";
const register = () => {
  // 在这里进行注册逻辑处理
  const data = {
    username: form.username,
    password: form.password,
    emailToken: form.emailToken,
    verifyCode: form.verificationCode,
    verifyCodeToken: form.verificationCodeToken
  }
  registerToast.sendRequest(data).then(res => {
    // 注册成功后返回JWT无需手动登录
    Local.setString("token", res.data.token);
    router.push("/");
  }).catch(() => {
    captchaRef.value.getVerificationCode();
  })
};
const onSubmit = () => {
  if (activeStep.value === 0) {
    verifyEmail();
  } else if (activeStep.value === 1) {
    register()
  }
}
</script>

<style lang="scss" scoped>
.register-page {
  padding: 10px;
}

.register-link {
  margin-top: 20px;
  text-align: center;
}

.van-button {
  white-space: nowrap;
  // margin-top: 10px;
}
</style>