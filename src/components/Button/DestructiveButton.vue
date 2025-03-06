<template>
  <button class="body-l">
    <span><slot></slot></span>
  </button>
</template>

<style lang="scss" scoped>
button {
  border-radius: 20px;
  height: 40px;
  color: white;
  background-color: $fire-opal;
  cursor: pointer;

  &:not(:disabled):hover {
    background-color: $american-pink;
  }

  span {
    font-size: 13px;
    font-weight: bold;
    line-height: 23px;
    color: white;
  }
}
</style>
