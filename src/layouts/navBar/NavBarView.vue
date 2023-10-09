<template>
  <van-nav-bar id="vanNavBar" :title="props.title" :fixed="true" safe-area-inset-top :clickable="props.clickable" :left-arrow="props.leftArrow" @click-left="onClickLeft">
    <template #right>
      <slot></slot>
    </template>
  </van-nav-bar>
</template>
<script lang="ts" setup>
const router = useRouter();
const onClickLeft = () => router.back();
const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  clickable: {
    type: Boolean,
    default: false,
  },
  leftArrow: {
    type: Boolean,
    default: true,
  }
});
onMounted(()=>{
  const vanNavBar = document.getElementById("vanNavBar");
  vanNavBar?.querySelector(".van-nav-bar__left")?.classList.add("van-haptics-feedback")
})
</script>
<script lang="ts">
export default {
  name: "NavBarView"
}
</script>