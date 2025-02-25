<template>
  <button class="body-l"><slot></slot></button>
</template>

<style lang="scss" scoped>
button {
  border-radius: 20px;
  height: 40px;
  color: var($main-purple);
  background-color: rgba(99, 95, 199, 0.1);
  &:hover {
    background-color: rgba(99, 95, 199, 0.25);
  }
}
</style>
