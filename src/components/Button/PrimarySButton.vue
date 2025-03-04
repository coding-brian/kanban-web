<script lang="ts" setup></script>

<template>
  <button class="body-l"><slot></slot></button>
</template>

<style lang="scss" scoped>
button {
  border-radius: 20px;
  height: 40px;
  color: white;
  background-color: $main-purple;
  cursor: pointer;

  &:not(:disabled):hover {
    background-color: $main-purple-hover;
  }
}
</style>
