<template>
  <template v-if="!requestStatus">
    <div v-if="chatItem.type == 2">
      <div v-if="message.rawText.startsWith('http')" style="width: 256px;height: 256px;">
        <img style="display: block;width: 100%;" :src="message.rawText" alt="">
      </div>
      <div v-else>{{ message.rawText }}</div>
    </div>
    <div v-if="chatItem.type == 1" class="markdown-body" v-html="message.text"></div>
  </template>
  <template v-else>
    <div style="display: flex;">
      <img src="@/assets/image/loading.gif" height="30" />
    </div>
  </template>
</template>
<script lang="ts" setup>
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css' // 导入代码高亮样式
import '@/assets/css/github-markdown.scss'
const props = defineProps(["chatItem","message", "requestStatus"]);
const message = reactive({
  rawText: '',
  text: '',
});
const requestStatus = ref<boolean>(props.requestStatus);
const md = new MarkdownIt({
  html: false,
  linkify: true,
  highlight(code: any, language: any) {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock(hljs.highlight(code, { language: lang }).value, lang)
    }
    return highlightBlock(hljs.highlightAuto(code).value, '')
  },
})

md.use(mila, { attrs: { target: '_blank', rel: 'noopener' } })
md.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })

watchEffect(() => {
  message.rawText = props.message;
  if (props.chatItem.type == 1) {
    message.text = md.render(props.message);
  }
})
watchEffect(() => {
  requestStatus.value = props.requestStatus;

})
function highlightBlock(str: string, lang?: string) {
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy"> 复制代码</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
}

</script>
<script lang="ts">
export default {
  name: "TextView"
}
</script>
<style lang="scss" scoped>
.markdown-body {
  line-height: 1.5;
  user-select: text;
  background: unset;
  font-size: 14px;
  letter-spacing: 0;
  word-spacing: 0;
  word-break: break-word;

  :deep(.code-block-wrapper) {
    font-size: 12px;
    position: relative;

    code.hljs {
      padding: 0;
    }

    pre {
      margin-bottom: 0 !important;
    }

    .code-block-header {
      position: absolute;
      top: 5px;
      right: 0;
      width: 100%;
      padding: 0 1rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      color: #b3b3b3;
      user-select: none;
    }

  }

}
</style>