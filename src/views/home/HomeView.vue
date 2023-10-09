<template>
  <main class="main">
    <add-chat-view />
    <van-row>
      <van-col span="24">
        <select ref="aiModel" name="" id="" @change="aiModelChange">
          <option value="gpt-3.5-turbo">gpt-3.5-turbo (ChatGPT)</option>
          <option value="gpt-3.5-turbo-16k">gpt-3.5-turbo-16k (ChatGPT)</option>
          <option value="ernit-bot">ernit-bot (文心一言)</option>
          <option value="ernit-bot-turbo">ernit-bot-turbo (文心一言)</option>
        </select>
      </van-col>
    </van-row>
    <div class="main-body">
      <div class="main-wrapper">
        <van-skeleton title :row="6" :loading="chatSkeletonLoading">
          <van-pull-refresh v-model="chatPullRefreshLoading" @refresh="onRefresh">
            <template v-for="item in chatList" :key="item.id">
              <van-swipe-cell>
                <van-cell v-hf :border="false" :title="item.name" :to="'/chat/' + item.id" />
                <template #right>
                  <van-button square type="primary" text="编辑" />
                  <van-button @click="handleChatDelete(item.id)" square type="danger" text="删除" />
                </template>
              </van-swipe-cell>
              <van-divider />
            </template>
          </van-pull-refresh>
        </van-skeleton>
      </div>
    </div>
    <tabber-view></tabber-view>
  </main>
</template>
<script setup lang="ts">
import TabberView from '@/layouts/tabBar/TabberView.vue';
import AddChatView from './components/AddChatView.vue';
import RequestToast from '@/utils/tips/RequestToast'

const chatList = ref<any[]>();
const aiModel = ref();
const chatSkeletonLoading = ref<boolean>(true)
const chatPullRefreshLoading = ref<boolean>(false)
const getChatWindowToast = new RequestToast(getChatWindow)
getChatWindowToast.successToast = false;
const getChatWIndowList = () => {
  getChatWindowToast.sendRequest().then(res => {
    chatList.value = res.data;
    chatSkeletonLoading.value = false;
    chatPullRefreshLoading.value = false;
  })
}
onActivated(() => {
  getChatWIndowList();
})

const handleChatDelete = (id: string) => {
  delChatWindow(id).then(res => {
    getChatWIndowList();
  })
}
const aiModelChange = (e: any) => {
  console.log(e.target.value);

}
const onRefresh = ()=>{
  chatPullRefreshLoading.value = true;
  getChatWIndowList();
}
</script>

<style lang="scss" scoped>
.btn-group {
  padding: 10px;
}

.main-body {
  height: 100%;
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;


  .van-divider {
    margin: 0;
  }
}

// .van-cell{
//   background: none;
// }
</style>