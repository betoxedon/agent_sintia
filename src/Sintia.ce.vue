<script setup lang="ts">
   import { computed, onMounted, ref, watch } from 'vue'
   import { firestore, doc, onSnapshot } from './firebase-config'
   import MonoClose from './MonoClose.vue'
   import MonoLogo from './MonoLogo.vue'
   import MonoSend from './MonoSend.vue'

   const props = defineProps({
      agentId: {
         type: String,
         required: true,
      },
   })

   watch(
      () => props.agentId,
      () => {
         console.log('watch() 🚀', props.agentId)
      },
      { immediate: true },
   )

   const today = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
   })

   const agentActive = ref({
      nickname: '',
      identifier: '',
      createdAt: 0,
      updatedAt: 0,
      docId: '',
      userId: '',
      welcomeMessage: '',
      colorId: '',
      colorStyle: '',
      fontFamilyId: '',
      fontFamilyStyle: '',
      screenSideId: '',
      screenSideStyle: '',
      imageUrl: '',
      allowedDomains: [],
   })

   const showChatStart = ref(true)
   const showChatAvatar = ref(true)
   const showChatBalloon = ref(true)
   const showChatDialog = ref(false)

   const screenSideStyle = computed(() => {
      if (agentActive.value.screenSideStyle) {
         let sideStyle = agentActive.value.screenSideStyle
         sideStyle += 'display: block;'
         return sideStyle
      } else {
         return 'display: none;'
      }
   })

   const screenSideClass = computed(() => {
      if (agentActive.value.screenSideId === 'id02') {
         return 'order-last'
      }
   })

   const closeChatBalloonStyle = computed(() => {
      if (agentActive.value.screenSideId === 'id01') {
         return 'left: -1.5px;'
      } else {
         return 'right: -1.5px;'
      }
   })

   const onChatAvatar = () => {
      showChatStart.value = false
      showChatDialog.value = true
   }

   const onCloseChatDialog = () => {
      showChatDialog.value = false
      showChatBalloon.value = false
      showChatStart.value = true
      showChatAvatar.value = true
   }

   onMounted(() => {
      console.log('onMounted() 🚀', props.agentId)
      onSnapshot(doc(firestore, 'agents', '68yvyXwMLJbgVina3GK0'), (doc: any) => {
         agentActive.value = doc.data()
      })
   })
</script>

<template>
   <div class="agent-default min-h-[66px]" :style="screenSideStyle">
      <div v-if="showChatDialog" class="chat-main show-in grid content-end">
         <div
            class="grid w-full grid-rows-[min-content_minmax(0px,_480px)] overflow-hidden rounded-xl border border-slate-200 shadow-lg"
            :style="agentActive.fontFamilyStyle">
            <div
               class="flex min-h-[74px] flex-col py-4 pl-5 pr-3"
               :style="agentActive.colorStyle">
               <div
                  class="relative grid grid-cols-[1fr_min-content_min-content] items-center gap-x-2">
                  <div class="flex flex-col truncate">
                     <span class="text-xl font-bold text-white">
                        {{ agentActive.nickname }}
                     </span>

                     <div class="flex items-center gap-x-1">
                        <span
                           class="mb-[0.5px] h-[9px] w-[9px] rounded-full bg-[#02fe04]"></span>
                        <span class="text-sm font-medium text-white">Online</span>
                     </div>
                  </div>

                  <div class="absolute right-2 top-0 flex gap-x-2">
                     <span class="cursor-pointer" @click="onCloseChatDialog()">
                        <MonoClose class="h-5 text-white" />
                     </span>
                  </div>
               </div>
            </div>

            <div class="grid grid-rows-[1fr_min-content] rounded-b-xl bg-white pb-2">
               <div class="grid grid-cols-2 content-start px-2 pb-1">
                  <span
                     class="col-span-2 mb-4 mt-1 place-self-center rounded-lg bg-surface-10 px-4 py-0.5 text-base">
                     {{ today }}
                  </span>

                  <div
                     class="col-span-full grid grid-cols-[min-content_77%] gap-x-2">
                     <div
                        class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white">
                        <img
                           v-if="agentActive.imageUrl"
                           :src="agentActive.imageUrl"
                           class="h-6 w-6" />
                        <MonoLogo v-else class="h-6 w-6 text-slate-400" />
                     </div>

                     <span
                        class="mb-[22px] mt-3 grid place-self-start self-start rounded-2xl rounded-tl-none px-3 py-1.5 text-base text-white"
                        :style="agentActive.colorStyle">
                        {{ agentActive.welcomeMessage }}
                     </span>
                  </div>
               </div>

               <div
                  class="mx-2 flex items-center overflow-hidden rounded-lg ring-1 ring-slate-300 has-[:focus]:ring-2 has-[:focus]:ring-primary-40">
                  <input
                     class="h-[40px] w-full bg-surface-10 pl-3 text-base placeholder:text-base"
                     autofocus
                     placeholder="Digite sua mensagem..." />

                  <div
                     class="border-transparente flex h-10 w-10 shrink-0 items-center justify-center rounded-r-lg bg-surface-10">
                     <MonoSend class="h-6 text-onsurface-20" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div
         v-if="showChatStart"
         class="chat-balloon flex h-[74px] flex-nowrap items-start gap-x-3 overflow-hidden p-[3px]"
         :class="{ 'justify-end': agentActive.screenSideId === 'id01' }">
         <div
            v-if="showChatBalloon"
            class="chat-balloon show-in relative flex w-full items-center gap-x-2 rounded-full border bg-white px-5 py-2 opacity-0 shadow-md"
            :class="screenSideClass">
            <div class="flex w-full items-center justify-between gap-x-3">
               <div
                  class="flex min-h-[48px] select-none items-center justify-center">
                  <span class="text-center" :style="agentActive.fontFamilyStyle">
                     {{ agentActive.welcomeMessage }}
                  </span>
               </div>
            </div>

            <div
               class="absolute top-[0.5px] cursor-pointer rounded-full bg-slate-400 p-0.5"
               :style="closeChatBalloonStyle"
               @click="showChatBalloon = false">
               <MonoClose class="h-4 w-4 text-white" />
            </div>
         </div>

         <div
            class="show-in relative flex h-[66px] w-[66px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border bg-white shadow-md hover:bg-slate-50"
            @click="onChatAvatar()">
            <img
               v-if="agentActive.imageUrl"
               :src="agentActive.imageUrl"
               class="h-10 w-10" />
            <MonoLogo v-else class="h-10 w-10 text-slate-400" />
         </div>
      </div>
   </div>
</template>

<style>
   *,
   :before,
   :after {
      box-sizing: border-box;
      border-width: 0;
      border-style: solid;
      border-color: #e5e7eb;
   }
   :before,
   :after {
      --tw-content: '';
   }
   html,
   :host {
      line-height: 1.5;
      -webkit-text-size-adjust: 100%;
      -moz-tab-size: 4;
      -o-tab-size: 4;
      tab-size: 4;
      font-family:
         ui-sans-serif,
         system-ui,
         sans-serif,
         'Apple Color Emoji',
         'Segoe UI Emoji',
         Segoe UI Symbol,
         'Noto Color Emoji';
      font-feature-settings: normal;
      font-variation-settings: normal;
      -webkit-tap-highlight-color: transparent;
   }
   body {
      margin: 0;
      line-height: inherit;
   }
   hr {
      height: 0;
      color: inherit;
      border-top-width: 1px;
   }
   abbr:where([title]) {
      -webkit-text-decoration: underline dotted;
      text-decoration: underline dotted;
   }
   h1,
   h2,
   h3,
   h4,
   h5,
   h6 {
      font-size: inherit;
      font-weight: inherit;
   }
   a {
      color: inherit;
      text-decoration: inherit;
   }
   b,
   strong {
      font-weight: bolder;
   }
   code,
   kbd,
   samp,
   pre {
      font-family:
         ui-monospace,
         SFMono-Regular,
         Menlo,
         Monaco,
         Consolas,
         Liberation Mono,
         Courier New,
         monospace;
      font-feature-settings: normal;
      font-variation-settings: normal;
      font-size: 1em;
   }
   small {
      font-size: 80%;
   }
   sub,
   sup {
      font-size: 75%;
      line-height: 0;
      position: relative;
      vertical-align: baseline;
   }
   sub {
      bottom: -0.25em;
   }
   sup {
      top: -0.5em;
   }
   table {
      text-indent: 0;
      border-color: inherit;
      border-collapse: collapse;
   }
   button,
   input,
   optgroup,
   select,
   textarea {
      font-family: inherit;
      font-feature-settings: inherit;
      font-variation-settings: inherit;
      font-size: 100%;
      font-weight: inherit;
      line-height: inherit;
      letter-spacing: inherit;
      color: inherit;
      margin: 0;
      padding: 0;
   }
   button,
   select {
      text-transform: none;
   }
   button,
   input:where([type='button']),
   input:where([type='reset']),
   input:where([type='submit']) {
      -webkit-appearance: button;
      background-color: transparent;
      background-image: none;
   }
   :-moz-focusring {
      outline: auto;
   }
   :-moz-ui-invalid {
      box-shadow: none;
   }
   progress {
      vertical-align: baseline;
   }
   ::-webkit-inner-spin-button,
   ::-webkit-outer-spin-button {
      height: auto;
   }
   [type='search'] {
      -webkit-appearance: textfield;
      outline-offset: -2px;
   }
   ::-webkit-search-decoration {
      -webkit-appearance: none;
   }
   ::-webkit-file-upload-button {
      -webkit-appearance: button;
      font: inherit;
   }
   summary {
      display: list-item;
   }
   blockquote,
   dl,
   dd,
   h1,
   h2,
   h3,
   h4,
   h5,
   h6,
   hr,
   figure,
   p,
   pre {
      margin: 0;
   }
   fieldset {
      margin: 0;
      padding: 0;
   }
   legend {
      padding: 0;
   }
   ol,
   ul,
   menu {
      list-style: none;
      margin: 0;
      padding: 0;
   }
   dialog {
      padding: 0;
   }
   textarea {
      resize: vertical;
   }
   input::-moz-placeholder,
   textarea::-moz-placeholder {
      opacity: 1;
      color: #9ca3af;
   }
   input::placeholder,
   textarea::placeholder {
      opacity: 1;
      color: #9ca3af;
   }
   button,
   [role='button'] {
      cursor: pointer;
   }
   :disabled {
      cursor: default;
   }
   img,
   svg,
   video,
   canvas,
   audio,
   iframe,
   embed,
   object {
      display: block;
      vertical-align: middle;
   }
   img,
   video {
      max-width: 100%;
      height: auto;
   }
   [hidden] {
      display: none;
   }
   strong {
      font-weight: 700;
   }
   svg {
      height: 1.5rem;
      width: 1.5rem;
      flex-shrink: 0;
   }
   img {
      height: auto;
      width: 100%;
      background-size: cover;
   }
   input {
      font-size: 17px;
      line-height: 22px;
      font-weight: 300;
   }
   @media (min-width: 1660px) {
      input {
         font-size: 19px;
         line-height: 25px;
      }
   }
   span {
      display: block;
      font-size: 15px;
      line-height: 19px;
      --tw-text-opacity: 1;
      color: rgb(15 23 42 / var(--tw-text-opacity));
   }
   @media (min-width: 1660px) {
      span {
         font-size: 17px;
         line-height: 22px;
      }
   }
   ::-moz-placeholder {
      font-size: 17px;
      line-height: 22px;
      font-weight: 300;
   }
   ::placeholder {
      font-size: 17px;
      line-height: 22px;
      font-weight: 300;
   }
   @media (min-width: 1660px) {
      ::-moz-placeholder {
         font-size: 19px;
         line-height: 25px;
      }
      ::placeholder {
         font-size: 19px;
         line-height: 25px;
      }
   }
   .agent-default {
      position: fixed;
      bottom: 1.25rem;
      max-height: 100vh;
      width: 100vh;
      max-width: 326px;
   }
   *,
   :before,
   :after {
      --tw-border-spacing-x: 0;
      --tw-border-spacing-y: 0;
      --tw-translate-x: 0;
      --tw-translate-y: 0;
      --tw-rotate: 0;
      --tw-skew-x: 0;
      --tw-skew-y: 0;
      --tw-scale-x: 1;
      --tw-scale-y: 1;
      --tw-pan-x: ;
      --tw-pan-y: ;
      --tw-pinch-zoom: ;
      --tw-scroll-snap-strictness: proximity;
      --tw-gradient-from-position: ;
      --tw-gradient-via-position: ;
      --tw-gradient-to-position: ;
      --tw-ordinal: ;
      --tw-slashed-zero: ;
      --tw-numeric-figure: ;
      --tw-numeric-spacing: ;
      --tw-numeric-fraction: ;
      --tw-ring-inset: ;
      --tw-ring-offset-width: 0px;
      --tw-ring-offset-color: #fff;
      --tw-ring-color: rgb(59 130 246 / 0.5);
      --tw-ring-offset-shadow: 0 0 #0000;
      --tw-ring-shadow: 0 0 #0000;
      --tw-shadow: 0 0 #0000;
      --tw-shadow-colored: 0 0 #0000;
      --tw-blur: ;
      --tw-brightness: ;
      --tw-contrast: ;
      --tw-grayscale: ;
      --tw-hue-rotate: ;
      --tw-invert: ;
      --tw-saturate: ;
      --tw-sepia: ;
      --tw-drop-shadow: ;
      --tw-backdrop-blur: ;
      --tw-backdrop-brightness: ;
      --tw-backdrop-contrast: ;
      --tw-backdrop-grayscale: ;
      --tw-backdrop-hue-rotate: ;
      --tw-backdrop-invert: ;
      --tw-backdrop-opacity: ;
      --tw-backdrop-saturate: ;
      --tw-backdrop-sepia: ;
      --tw-contain-size: ;
      --tw-contain-layout: ;
      --tw-contain-paint: ;
      --tw-contain-style: ;
   }
   ::backdrop {
      --tw-border-spacing-x: 0;
      --tw-border-spacing-y: 0;
      --tw-translate-x: 0;
      --tw-translate-y: 0;
      --tw-rotate: 0;
      --tw-skew-x: 0;
      --tw-skew-y: 0;
      --tw-scale-x: 1;
      --tw-scale-y: 1;
      --tw-pan-x: ;
      --tw-pan-y: ;
      --tw-pinch-zoom: ;
      --tw-scroll-snap-strictness: proximity;
      --tw-gradient-from-position: ;
      --tw-gradient-via-position: ;
      --tw-gradient-to-position: ;
      --tw-ordinal: ;
      --tw-slashed-zero: ;
      --tw-numeric-figure: ;
      --tw-numeric-spacing: ;
      --tw-numeric-fraction: ;
      --tw-ring-inset: ;
      --tw-ring-offset-width: 0px;
      --tw-ring-offset-color: #fff;
      --tw-ring-color: rgb(59 130 246 / 0.5);
      --tw-ring-offset-shadow: 0 0 #0000;
      --tw-ring-shadow: 0 0 #0000;
      --tw-shadow: 0 0 #0000;
      --tw-shadow-colored: 0 0 #0000;
      --tw-blur: ;
      --tw-brightness: ;
      --tw-contrast: ;
      --tw-grayscale: ;
      --tw-hue-rotate: ;
      --tw-invert: ;
      --tw-saturate: ;
      --tw-sepia: ;
      --tw-drop-shadow: ;
      --tw-backdrop-blur: ;
      --tw-backdrop-brightness: ;
      --tw-backdrop-contrast: ;
      --tw-backdrop-grayscale: ;
      --tw-backdrop-hue-rotate: ;
      --tw-backdrop-invert: ;
      --tw-backdrop-opacity: ;
      --tw-backdrop-saturate: ;
      --tw-backdrop-sepia: ;
      --tw-contain-size: ;
      --tw-contain-layout: ;
      --tw-contain-paint: ;
      --tw-contain-style: ;
   }
   .absolute {
      position: absolute;
   }
   .relative {
      position: relative;
   }
   .right-2 {
      right: 0.5rem;
   }
   .top-0 {
      top: 0;
   }
   .top-\[0\.5px\] {
      top: 0.5px;
   }
   .order-last {
      order: 9999;
   }
   .col-span-2 {
      grid-column: span 2 / span 2;
   }
   .col-span-full {
      grid-column: 1 / -1;
   }
   .mx-2 {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
   }
   .mb-4 {
      margin-bottom: 1rem;
   }
   .mb-\[0\.5px\] {
      margin-bottom: 0.5px;
   }
   .mb-\[22px\] {
      margin-bottom: 22px;
   }
   .mt-1 {
      margin-top: 0.25rem;
   }
   .mt-3 {
      margin-top: 0.75rem;
   }
   .block {
      display: block;
   }
   .flex {
      display: flex;
   }
   .grid {
      display: grid;
   }
   .h-10 {
      height: 2.5rem;
   }
   .h-4 {
      height: 1rem;
   }
   .h-5 {
      height: 1.25rem;
   }
   .h-6 {
      height: 1.5rem;
   }
   .h-8 {
      height: 2rem;
   }
   .h-\[40px\] {
      height: 40px;
   }
   .h-\[66px\] {
      height: 66px;
   }
   .h-\[74px\] {
      height: 74px;
   }
   .h-\[9px\] {
      height: 9px;
   }
   .min-h-\[48px\] {
      min-height: 48px;
   }
   .min-h-\[66px\] {
      min-height: 66px;
   }
   .min-h-\[74px\] {
      min-height: 74px;
   }
   .w-10 {
      width: 2.5rem;
   }
   .w-4 {
      width: 1rem;
   }
   .w-6 {
      width: 1.5rem;
   }
   .w-8 {
      width: 2rem;
   }
   .w-\[66px\] {
      width: 66px;
   }
   .w-\[9px\] {
      width: 9px;
   }
   .w-full {
      width: 100%;
   }
   .shrink-0 {
      flex-shrink: 0;
   }
   .cursor-pointer {
      cursor: pointer;
   }
   .select-none {
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
   }
   .grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
   }
   .grid-cols-\[1fr_min-content_min-content\] {
      grid-template-columns: 1fr min-content min-content;
   }
   .grid-cols-\[min-content_77\%\] {
      grid-template-columns: min-content 77%;
   }
   .grid-rows-\[1fr_min-content\] {
      grid-template-rows: 1fr min-content;
   }
   .grid-rows-\[min-content_minmax\(0px\,_480px\)\] {
      grid-template-rows: min-content minmax(0px, 480px);
   }
   .flex-col {
      flex-direction: column;
   }
   .flex-nowrap {
      flex-wrap: nowrap;
   }
   .content-start {
      align-content: flex-start;
   }
   .content-end {
      align-content: flex-end;
   }
   .items-start {
      align-items: flex-start;
   }
   .items-center {
      align-items: center;
   }
   .justify-end {
      justify-content: flex-end;
   }
   .justify-center {
      justify-content: center;
   }
   .justify-between {
      justify-content: space-between;
   }
   .gap-x-1 {
      -moz-column-gap: 0.25rem;
      column-gap: 0.25rem;
   }
   .gap-x-2 {
      -moz-column-gap: 0.5rem;
      column-gap: 0.5rem;
   }
   .gap-x-3 {
      -moz-column-gap: 0.75rem;
      column-gap: 0.75rem;
   }
   .place-self-start {
      place-self: start;
   }
   .place-self-center {
      place-self: center;
   }
   .self-start {
      align-self: flex-start;
   }
   .overflow-hidden {
      overflow: hidden;
   }
   .truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
   }
   .rounded-2xl {
      border-radius: 1rem;
   }
   .rounded-full {
      border-radius: 9999px;
   }
   .rounded-lg {
      border-radius: 0.5rem;
   }
   .rounded-xl {
      border-radius: 0.75rem;
   }
   .rounded-b-xl {
      border-bottom-right-radius: 0.75rem;
      border-bottom-left-radius: 0.75rem;
   }
   .rounded-r-lg {
      border-top-right-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
   }
   .rounded-tl-none {
      border-top-left-radius: 0;
   }
   .border {
      border-width: 1px;
   }
   .border-slate-200 {
      --tw-border-opacity: 1;
      border-color: rgb(226 232 240 / var(--tw-border-opacity));
   }
   .bg-\[\#02fe04\] {
      --tw-bg-opacity: 1;
      background-color: rgb(2 254 4 / var(--tw-bg-opacity));
   }
   .bg-slate-400 {
      --tw-bg-opacity: 1;
      background-color: rgb(148 163 184 / var(--tw-bg-opacity));
   }
   .bg-surface-10 {
      --tw-bg-opacity: 1;
      background-color: rgb(241 243 249 / var(--tw-bg-opacity));
   }
   .bg-white {
      --tw-bg-opacity: 1;
      background-color: rgb(255 255 255 / var(--tw-bg-opacity));
   }
   .p-0 {
      padding: 0;
   }
   .p-0\.5 {
      padding: 0.125rem;
   }
   .p-\[3px\] {
      padding: 3px;
   }
   .px-2 {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
   }
   .px-3 {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
   }
   .px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
   }
   .px-5 {
      padding-left: 1.25rem;
      padding-right: 1.25rem;
   }
   .py-0 {
      padding-top: 0;
      padding-bottom: 0;
   }
   .py-0\.5 {
      padding-top: 0.125rem;
      padding-bottom: 0.125rem;
   }
   .py-1 {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
   }
   .py-1\.5 {
      padding-top: 0.375rem;
      padding-bottom: 0.375rem;
   }
   .py-2 {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
   }
   .py-4 {
      padding-top: 1rem;
      padding-bottom: 1rem;
   }
   .pb-1 {
      padding-bottom: 0.25rem;
   }
   .pb-2 {
      padding-bottom: 0.5rem;
   }
   .pl-3 {
      padding-left: 0.75rem;
   }
   .pl-5 {
      padding-left: 1.25rem;
   }
   .pr-3 {
      padding-right: 0.75rem;
   }
   .text-center {
      text-align: center;
   }
   .text-base {
      font-size: 15px;
      line-height: 19px;
   }
   .text-sm {
      font-size: 12px;
      line-height: 17px;
   }
   .text-xl {
      font-size: 19px;
      line-height: 25px;
   }
   .font-bold {
      font-weight: 700;
   }
   .font-medium {
      font-weight: 500;
   }
   .text-onsurface-20 {
      --tw-text-opacity: 1;
      color: rgb(100 116 139 / var(--tw-text-opacity));
   }
   .text-slate-400 {
      --tw-text-opacity: 1;
      color: rgb(148 163 184 / var(--tw-text-opacity));
   }
   .text-white {
      --tw-text-opacity: 1;
      color: rgb(255 255 255 / var(--tw-text-opacity));
   }
   .opacity-0 {
      opacity: 0;
   }
   .shadow-lg {
      --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
         0 4px 6px -4px var(--tw-shadow-color);
      box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
         var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
   }
   .shadow-md {
      --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color),
         0 2px 4px -2px var(--tw-shadow-color);
      box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
         var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
   }
   .ring-1 {
      --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
         var(--tw-ring-offset-color);
      --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
         calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
      box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
         var(--tw-shadow, 0 0 #0000);
   }
   .ring-slate-300 {
      --tw-ring-opacity: 1;
      --tw-ring-color: rgb(203 213 225 / var(--tw-ring-opacity));
   }
   @keyframes showShowIn {
      0% {
         opacity: 0;
      }
      to {
         opacity: 1;
      }
   }
   .show-in {
      animation-name: showShowIn;
      animation-duration: 2s;
      animation-fill-mode: forwards;
   }
   .chat-balloon.show-in {
      animation-delay: 2s;
   }
   .placeholder\:text-base::-moz-placeholder {
      font-size: 15px;
      line-height: 19px;
   }
   .placeholder\:text-base::placeholder {
      font-size: 15px;
      line-height: 19px;
   }
   .hover\:bg-slate-50:hover {
      --tw-bg-opacity: 1;
      background-color: rgb(248 250 252 / var(--tw-bg-opacity));
   }
   .has-\[\:focus\]\:ring-2:has(:focus) {
      --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
         var(--tw-ring-offset-color);
      --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
         calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
      box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
         var(--tw-shadow, 0 0 #0000);
   }
   .has-\[\:focus\]\:ring-primary-40:has(:focus) {
      --tw-ring-opacity: 1;
      --tw-ring-color: rgb(101 144 253 / var(--tw-ring-opacity));
   }
</style>
