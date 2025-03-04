<template>
  <button class="body-l"><slot></slot></button>
</template>

<style lang="scss" scoped>
button {
  border-radius: 20px;
  height: 40px;
  color: white;
  background-color: var(--fire-opal);
  cursor: pointer;

  &:not(:disabled):hover {
    background-color: var(--american-pink);
  }
}
</style>
