
<template>
  <div class="main main-chat">
    <nav-bar-view :title="title">
      <van-icon v-hf @click="clearChatList" name="delete-o" />
      <van-icon v-hf v-if="currentType === 'chat'" @click="toggleChatMode" name="clock-o" :color="chatMode ? '#18A058' : ''" />
    </nav-bar-view>
    <div class="main-body">
      <div class="chat-wrapper" ref="scrollWrpperRef">
        <div class="chat-body">
          <template v-for="(item, index) in chatList" :key="index">
            <div class="chat-row chat-row-reverse" v-if="item.role == 1">
              <div class="chat-avatar">
                <div class="n-avatar">
                  <img loading="eager" src="http://imgurl.diadi.cn/imgs/2023/06/18d6d07a10d1220c.jpg" />
                </div>
              </div>
              <div class="chat-message">
                <text class="chat-time">{{ formatTime(item.createTime) }}</text>
                <div class="chat-text flex flex-row-reverse">
                  <div class="chat-text-words">
                    <div class="chat-content"> {{ item.message }} </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="chat-row" v-else-if="item.role == 2">
              <div class="chat-avatar">
                <div class="n-avatar">
                  <span class="text-[28px] dark:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" width="1em" height="1em">
                      <path d="M29.71,13.09A8.09,8.09,0,0,0,20.34,2.68a8.08,8.08,0,0,0-13.7,2.9A8.08,8.08,0,0,0,2.3,18.9,8,8,0,0,0,3,25.45a8.08,8.08,0,0,0,8.69,3.87,8,8,0,0,0,6,2.68,8.09,8.09,0,0,0,7.7-5.61,8,8,0,0,0,5.33-3.86A8.09,8.09,0,0,0,29.71,13.09Zm-12,16.82a6,6,0,0,1-3.84-1.39l.19-.11,6.37-3.68a1,1,0,0,0,.53-.91v-9l2.69,1.56a.08.08,0,0,1,.05.07v7.44A6,6,0,0,1,17.68,29.91ZM4.8,24.41a6,6,0,0,1-.71-4l.19.11,6.37,3.68a1,1,0,0,0,1,0l7.79-4.49V22.8a.09.09,0,0,1,0,.08L13,26.6A6,6,0,0,1,4.8,24.41ZM3.12,10.53A6,6,0,0,1,6.28,7.9v7.57a1,1,0,0,0,.51.9l7.75,4.47L11.85,22.4a.14.14,0,0,1-.09,0L5.32,18.68a6,6,0,0,1-2.2-8.18Zm22.13,5.14-7.78-4.52L20.16,9.6a.08.08,0,0,1,.09,0l6.44,3.72a6,6,0,0,1-.9,10.81V16.56A1.06,1.06,0,0,0,25.25,15.67Zm2.68-4-.19-.12-6.36-3.7a1,1,0,0,0-1.05,0l-7.78,4.49V9.2a.09.09,0,0,1,0-.09L19,5.4a6,6,0,0,1,8.91,6.21ZM11.08,17.15,8.38,15.6a.14.14,0,0,1-.05-.08V8.1a6,6,0,0,1,9.84-4.61L18,3.6,11.61,7.28a1,1,0,0,0-.53.91ZM12.54,14,16,12l3.47,2v4L16,20l-3.47-2Z" fill="currentColor"></path>
                    </svg>
                  </span>
                </div>
              </div>
              <div class="chat-message">
                <text class="chat-time ">{{ formatTime(item.createTime) }}</text>
                <div class="chat-text flex">
                  <div class="chat-text-words">
                    <div class="chat-content">
                      <text-view :message="item.message + ((!chatList[index + 1] && responseStatus) ? inputing : '')" :requestStatus="(!chatList[index + 1]) && requestStatus" :chat-item="currentChatWindow"></text-view>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div class="stop-response" v-if="responseStatus || requestStatus" @click="handleStopResponse">停止响应</div>
        </div>
      </div>
    </div>
    <fixed-footer-view>
      <div class="footer">
        <div class="send-wrapper" v-on:click.self="() => vanInputRef.focus()">
          <van-field id="input" ref="vanInputRef" v-model="chatMessage" :rows="1" :autosize="{ maxHeight: 48 }" type="textarea" :placeholder="'输入您的问题'" @click="handleChatFocus" />
          <div class="send" @click="handleClick">
            <van-icon name="guide-o" />
          </div>
        </div>
      </div>
    </fixed-footer-view>
  </div>
</template>
<script lang="ts" setup async>
import NavBarView from '@/layouts/navBar/NavBarView.vue';
import FixedFooterView from '@/layouts/footer/FixedFooterView.vue';
import TextView from '@/components/chat/TextView.vue';
import { onActivated, onMounted, reactive, ref, watch } from 'vue';
import { formatTime, getTimestamp } from '@/utils/dateformat'
import { showNotify, showConfirmDialog } from 'vant';
import { imageGenerations } from '@/api/images';
const route = useRoute();
const router = useRouter();
// const chatStore = useChatStore();
const paramsId = route.params.id as string;
let currentChatWindow: any;
onBeforeMount(async () => {
  try {
    const item = await getChatWindowById(paramsId);
    currentChatWindow = item.data;
    chatMode.value = currentChatWindow.usingContext;
    currentType.value = currentChatWindow.type === 1 ? 'chat' : 'createImage';
    title.value = currentChatWindow.name;
    await loadChatMessage();
  } catch (e) {
    router.push("/")
  }
})

const scrollWrpperRef = ref<HTMLDivElement>();
const vanInputRef = ref();
// 聊天列表

const currentType = ref();
const chatList = ref<any[]>([]);
const chatMessage = ref('');
const inputing = ref('_');
// 对话模式 true=连续对话
const chatMode = ref<boolean>();
// 请求状态，true:已发送请求，但服务器还未响应
const requestStatus = ref<boolean>(false);
// 响应状态，true:服务器正在响应中
const responseStatus = ref<boolean>(false);
// 用户输入
const requestMessage = reactive({
  role: 1,
  message: "",
  createTime: 0,
})
// 系统响应
const responseMessage = reactive({
  role: 2,
  message: "",
  createTime: 0,
})
// 获取消息
const loadChatMessage = async () => {
  const currentChatListResponse = await getChatMessage({ windowId: paramsId });
  const currentChatList = currentChatListResponse.data;
  chatList.value = currentChatList;
  return Promise.resolve(currentChatList);
}
const title = ref<string>();

onActivated(() => {
  title.value = currentChatWindow.name;
})
onBeforeUnmount(() => {
  // 页面卸载时执行的逻辑
  if (currentType.value === 'chat' && (requestStatus.value || responseStatus.value)) {
    handleResponseEnd();
  }
});
let eventSource: EventSource;
onMounted(() => {
  scrollBottom();
})
// 滚动条滚到到最底部
const scrollBottom = () => {
  nextTick(() => {
    const scrollElem = scrollWrpperRef.value;
    scrollElem!.scrollTop = scrollElem!.scrollHeight;
  })
}

watch([() => chatList.value.length, requestStatus, responseStatus], () => {
  scrollBottom();
})
const token = ref<string>("");
// 点击发送事件
const handleClick = async () => {
  if (respondingHandler() || !chatMessage.value) return;

  // 用户聊天内容写入当前聊天列表
  requestMessage.message = chatMessage.value;
  requestMessage.createTime = getTimestamp();
  chatList.value.push({ ...requestMessage });
  const postChatMessageResponse = await postChatMessage({ message: requestMessage.message, windowId: paramsId });
  token.value = postChatMessageResponse.data.token;

  chatMessage.value = "";
  // 开启响应状态
  requestStatus.value = true;

  // 聊天模式
  if (currentType.value === 'chat') {
    responseMessage.createTime = getTimestamp();
    // // 是否连续对话
    // const chatMessageList = chatMode.value ? [...chatList.value] : [{ ...requestMessage }];
    // AI响应写入当前聊天列表
    chatList.value.push(responseMessage);
    // 发送请求
    // const res = await chatSend(chatMessageList);

    // sse事件
    eventSource = v1ChatSSE({ token: token.value });
    eventSource.onopen = () => {
      // 成功连接sse之后开启响应状态，此时请求状态已结束
      responseStatus.value = true;
      requestStatus.value = false;
    }
    eventSource.onmessage = (e) => {
      handleMessage(e.data);
      scrollBottom();
    }
    eventSource.onerror = (e) => {
      handleResponseEnd();
    }
  } else {

    // AI响应写入当前聊天列表
    chatList.value.push(responseMessage);
    // 图像生成模式
    await imageCreate();
  }


}
// 处理响应结束
const handleResponseEnd = () => {
  // 响应结束
  requestStatus.value = false;
  responseStatus.value = false;
  // // 将数据存至storage
  // chatStore.addChatList({ ...requestMessage }, { ...responseMessage })
  // 更新聊天列表，与storage始终保持一致
  chatList.value.pop();
  const data = {};
  Object.assign(data,responseMessage);
  chatList.value.push(data);

  // loadChatMessage().then(res => {
  // });
  // 清空请求和响应内容
  responseMessage.message = "";
  requestMessage.message = "";
  eventSource.close();
}
// 处理响应
const handleMessage = (data: any) => {
  data = JSON.parse(data)
  if (data.error) {
    responseMessage.message = data.error.message;
    handleResponseEnd();
  } else {
    const content = data.content;
    responseMessage.message += content || '';
    if (data.done) {
      handleResponseEnd();
    }
  }
}
// 停止响应
const handleStopResponse = () => {
  if (token.value) {
    v1ChatStop(token.value).then(res => {
      handleResponseEnd();
    })
  }
}
// 切换对话模式
const toggleChatMode = () => {
  if (respondingHandler()) return;
  chatMode.value = !chatMode.value;
  // chatStore.setChatMode(chatMode.value);
  putChatWindow({
    id: paramsId,
    usingContext: chatMode.value ? 1 : 0
  }).then(res => {
    showNotify({
      type: "success",
      message: "已" + (chatMode.value ? '开启' : '关闭') + "连续对话",
    })
  })
}
/**
 * 图像生成
 */
const imageCreate = async () => {
  responseStatus.value = true;
  return imageGenerations({ prompt: requestMessage.message }).then((res: any) => {
    if (res.data.error) {
      showNotify({
        type: "danger",
        message: res.data.message
      })
      responseMessage.message = res.data.message;
    } else {
      responseMessage.message = res.data.images[0];
    }
    requestStatus.value = false;
    responseStatus.value = false;
    scrollBottom();

    // // 将数据存至storage
    // chatStore.addChatList({ ...requestMessage }, { ...responseMessage })
    // // 更新聊天列表，与storage始终保持一致
    // chatList.value = [...chatStore.currentChatList.list];
    loadChatMessage();
    // 清空请求和响应内容
    requestMessage.message = "";
    responseMessage.message = "";
  })
}

// 清空历史记录
const clearChatList = () => {
  if (respondingHandler()) return;
  showConfirmDialog({
    title: "提示",
    message: "清空历史记录？"
  }).then(() => {
    // chatStore.removeChatStorage();
    clearHistoryChatMessage(paramsId).then(res => {
      loadChatMessage();
    })
  })
}
// AI响应中状态处理
const respondingHandler = () => {
  if (responseStatus.value || requestStatus.value) {
    showNotify({
      type: "danger",
      message: "AI助手正在响应"
    })
    return true;
  }
  return false;
}
const handleChatFocus = () => {
  setTimeout(() => {
    scrollBottom();
  }, 200)
}





</script>

<style lang="scss" scoped>
.van-nav-bar {
  .van-icon {
    margin-left: 10px;
  }
}

.main-chat {
  overflow: hidden;

  .main-body {
    padding: 48px 0 0;
    overflow: hidden;
    flex: 1 1 0%;
  }

  :deep(.van-icon) {
    font-size: 20px !important;
    font-weight: bold;
  }
}

.footer {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  padding: 10px;

  .send-wrapper {
    border: 1px solid var(--van-border-color);
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 30px;
    padding: 0 0 0 15px;
    --van-cell-line-height: 1.2;
    display: flex;
    align-items: center;
  }

  .van-field {
    padding: 0 0 0 0;

    &::after {
      display: none;
    }
  }

  .send {
    width: 40px;
    height: 40px;
    color: #fff;
    background: #18a058;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    flex-shrink: 0;
    // margin-right: -13px;
    margin: -1px -1px -1px 0;
  }
}

.chat-wrapper {
  overflow-y: auto;
  height: 100%;
  padding: 15px 7px;
  // height: 100%;
  box-sizing: border-box;

  .stop-response {
    width: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    background: #18a058;
    padding: 5px 10px;
    color: #fff;
    border-radius: 4px;
  }

  .chat-row {
    display: flex;
    overflow: hidden;
    margin-bottom: 20px;

    &.chat-row-reverse {
      flex-direction: row-reverse;

      .chat-time {
        text-align: right;
      }

      .n-avatar {
        width: 32px;
        height: 32px;
        font-size: 14px;
        display: inline-flex;
        position: relative;
        overflow: hidden;
        text-align: center;
        border: none;
        border-radius: 50%;
        transition: border-color .3s cubic-bezier(0.4, 0, 0.2, 1), background-color .3s cubic-bezier(0.4, 0, 0.2, 1), color .3s cubic-bezier(0.4, 0, 0.2, 1);
        margin-left: 10px;

        image {
          width: 100%;
          height: 100%;
        }
      }
    }

    .chat-avatar {
      svg {
        font-size: 28px;
        margin-right: 5px;
      }
    }

    .chat-message {
      flex: 1;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
      width: 70%;

      .chat-time {
        display: inline-block;
        width: 100%;
        font-size: 12px;
        line-height: 14px;
      }

      .chat-text {
        margin-top: 6px;
      }

      .chat-text-words {
        border-radius: 8px;
        max-width: 100%;
      }

      .chat-content {
        font-size: 14px;
        padding: 8px;
        word-break: break-all;
      }
    }
  }
}
</style>