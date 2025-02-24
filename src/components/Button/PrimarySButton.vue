<script lang="ts" setup></script>

<template>
  <button class="text-medium"><slot></slot></button>
</template>

<style lang="scss" scoped>
button {
  border-radius: 20px;
  height: 40px;
  color: white;
  background-color: var(--main-purple);
}

button:hover {
  background-color: var(--main-purple-hover);
}
</style>
