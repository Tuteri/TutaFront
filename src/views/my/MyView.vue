<template>
  <div>
    <div class="content">
      <van-cell-group>
        <van-cell title="账号设置" is-link />
        <van-cell title="通用设置" is-link />
      </van-cell-group>
    </div>
    <tabber-view></tabber-view>
  </div>
</template>
<script lang="ts" setup>
import TabberView from '@/layouts/tabBar/TabberView.vue';

</script>
<style lang="scss" scoped>
.content {
  height: calc(100% - 50px);
}
</style>