<script lang="ts" setup></script>

<template>
  <button class="heading-l"><slot></slot></button>
</template>

<style lang="scss" scoped>
button {
  border-radius: 24px;
  height: 48px;
  color: white;
  background-color: var($main-purple);
  &:hover {
    background-color: var($main-purple-hover);
  }
}
</style>
