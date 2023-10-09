<template>
  <van-row class="btn-group" gutter="10">
    <van-col span="24">
      <van-button type="primary" @click="createChat()" block>新建对话</van-button>
    </van-col>
    <!-- <van-col span="12">
        <van-button type="primary" @click="createChat(2)" block>新建图像创作</van-button>
      </van-col> -->
  </van-row>
</template>

<script lang="ts">
import { postChatWindow } from "@/api/chatWindow";
export default {
  name: "AddChatView",
  setup() {
    const router = useRouter();
    const createChat = (type = 1) => {
      postChatWindow({ type }).then((res: any) => {
        router.push("/chat/" + res.data.id);
      });
    }
    return { createChat };
  }
}
</script>
<style></style>