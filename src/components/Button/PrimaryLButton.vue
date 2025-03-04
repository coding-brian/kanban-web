<script lang="ts" setup></script>

<template>
  <button class="heading-l"><slot></slot></button>
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
}
</style>
