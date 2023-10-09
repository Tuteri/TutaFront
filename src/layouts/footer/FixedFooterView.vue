<template>
  <div class="footer-fixed">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>

</script>
<style lang="scss" scoped>
.footer-fixed{
  min-height: 50px;
  max-height: 90px;
  position: sticky;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>