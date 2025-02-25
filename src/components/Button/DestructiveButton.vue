<template>
  <button class="body-l"><slot></slot></button>
</template>

<style lang="scss" scoped>
button {
  border-radius: 20px;
  height: 40px;
  color: white;
  background-color: var(--fire-opal);
  &:hover {
    background-color: var(--american-pink);
  }
}
</style>
