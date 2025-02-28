<template>
  <div class="mask">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.mask {
  position: absolute;
  background-color: black;
  opacity: 50%;
  height: 100vh;
  width: 100%;
}
</style>
