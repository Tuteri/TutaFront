<template>
  <van-image class="verification-code" :src="verificationCodeImage" @click="getVerificationCode" />
</template>

<script setup lang="ts">
const props = defineProps(["CaptchaToken"])
const emits = defineEmits(["update:CaptchaToken"])
const verificationCodeImage = ref('');

const getVerificationCode = () => {
  getCaptcha().then(res => {
    verificationCodeImage.value = res.data.captcha;
    emits("update:CaptchaToken", res.data.token)
  })
}
getVerificationCode();

defineExpose({
  getVerificationCode,
})
</script>
<script lang="ts">
export default {
  name: "CaptchaView"
}
</script>
<style scoped lang="scss">
.verification-code {
  height: 28px;
}
</style>