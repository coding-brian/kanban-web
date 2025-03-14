<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleIsDark = useToggle(isDark)
const toggle = async () => {
  setTimeout(() => {
    toggleIsDark()
  }, 400)
}
</script>

<template>
  <label class="toggle">
    <input type="checkbox" :value="isDark" @click="toggle" />
    <span class="slider"></span>
  </label>
</template>

<style lang="scss" scoped>
/* 切換按鈕的容器 */
.toggle {
  position: relative;
  width: 40px; /* 背景寬度 */
  height: 20px; /* 背景高度 */
  display: inline-block;
}

/* 隱藏原始的 checkbox */
.toggle {
  input {
    display: none;
  }
}

/* 背景設置 */
.slider {
  position: absolute;
  cursor: pointer;
  background-color: $main-purple; /* 背景顏色 */
  border-radius: 50px; /* 完全圓角 */
  width: 100%;
  height: 100%;
}

/* 滑塊設置 */
.slider::before {
  content: '';
  position: absolute;
  width: 15px; /* 滑塊的直徑 */
  height: 15px;
  background-color: #ffffff; /* 滑塊顏色 */
  border-radius: 50%; /* 圓形 */
  top: 50%;
  left: 4px; /* 初始位置 */
  transform: translateY(-50%);
  transition: 0.4s; /* 平滑效果 */
}

/* 當 checkbox 被勾選時，滑塊移動 */
.toggle input[type='checkbox']:checked + .slider::before {
  left: calc(100% - 19px); /*滑動到右邊 */
}
</style>
