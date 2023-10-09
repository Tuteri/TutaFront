import { defineStore } from 'pinia'
import { Local } from '@/utils/storage'
import type { ChatMessage } from '@/utils/interface/interface';
import { v4 as uuidv4 } from 'uuid';
import { getTimestamp } from '../utils/dateformat';
interface ChatInfo {
  // 会话id
  id: string,
  name: string,
  // 连续对话模式 仅限chat
  usingContext: boolean,
  // 聊天记录
  list: ChatMessage[],
  // 创建时间
  createdTime: number,
  // 模式 chat=对话 createImage=图像创建
  type: string,
  // ai模型，gpt,ernie等
  model: string,
}
const chat = Local.get("chatStorage") || {
  chatList: [],
  currentId: null,
};
export const useChatStore = defineStore('chat', {
  state() {
    return {
      // 对话集合
      chatList: chat.chatList as ChatInfo[],
      // 当前对话id
      currentId: chat.currentId as string,
    }
  },
  actions: {
    /**
     * 添加对话记录
     * @param payload 
     */
    addChatList(...payload: ChatMessage[]) {
      this.currentChatList.list.push(...payload);
      this.setChatStorage();
    },
    removeChatList(...payload:string[]){
      this.chatList = this.chatList.filter((value)=>!payload.includes(value.id))
      this.setChatStorage();
    },
    /**
     * 获取对话记录
     * @param id id值
     */
    getChatListById(id: String) {
      return this.chatList.find((item: ChatInfo) => item.id === id)
    },
    /**
     * 设置对话模式
     * @param payload 连续对话 true/false
     */
    setChatMode(payload: boolean) {
      this.currentChatList.usingContext = payload;
      this.setChatStorage();
    },
    setCurrentId(id: string) {
      this.currentId = id;
      this.setChatStorage();
    },
    /**
     * 创建新对话
     * @param type 1=chat 2=createImage
     */
    createChat(type: number = 1, name: string = "") {
      const id = uuidv4();
      this.currentId = id;
      this.chatList.unshift({
        id,
        usingContext: true,
        list: [],
        createdTime: getTimestamp(),
        type: type === 1 ? "chat" : "createImage",
        name: name || id,
        model: 'gpt-3.5-turbo-16k',
      })
      this.setChatStorage();
      return id;
    },
    // 设置缓存
    setChatStorage() {
      let data = {
        chatList: this.chatList,
        currentId: this.currentId
      }
      Local.set("chatStorage", data);
    },
    removeChatStorage() {
      this.currentChatList.list = [];
      this.setChatStorage();
    },
    // 缓存初始化
    init() {
      let chatStorage = Local.get("chatStorage");
      // 创建新的缓存
      if (!chatStorage) {
        this.createChat();
        this.setChatStorage();
      } else {
        // 读取已创建的缓存
        this.chatList = chatStorage.chatList;
        this.currentId = chatStorage.currentId
      }
    }
  },
  getters: {
    /**
     * 获取当前对话
     * @returns ChatInfo 当前对话
     */
    currentChatList(): ChatInfo {
      let list = this.chatList;
      let chat = list.find((item: ChatInfo, index: number) => {
        return item.id === this.currentId;
      })
      if (!chat) {
        chat = {} as ChatInfo;
      }
      return chat;
    },
  }
})