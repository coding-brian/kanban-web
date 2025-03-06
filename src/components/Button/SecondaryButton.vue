<template>
  <button class="body-l">
    <span><slot></slot></span>
  </button>
</template>

<style lang="scss" scoped>
button {
  border-radius: 20px;
  height: 40px;
  color: $main-purple;
  background-color: rgba(99, 95, 199, 0.1);
  cursor: pointer;

  &:not(:disabled):hover {
    background-color: rgba(99, 95, 199, 0.25);
  }

  span {
    font-size: 13px;
    font-weight: bold;
    line-height: 23px;
    color: $main-purple;
  }
}
</style>
