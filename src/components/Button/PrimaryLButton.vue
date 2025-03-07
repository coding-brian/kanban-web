<script lang="ts" setup></script>

<template>
  <button class="heading-l">
    <span><slot></slot></span>
  </button>
</template>

<style lang="scss" scoped>
button {
  border-radius: 24px;
  height: 48px;
  color: white;
  background-color: $main-purple;
  padding-left: 24px;
  padding-right: 24px;
  cursor: pointer;

  &:not(:disabled):hover {
    background-color: $main-purple-hover;
  }

  span {
    font-size: 13px;
    font-weight: bold;
    line-height: 23px;
    color: white;
  }
}
</style>
