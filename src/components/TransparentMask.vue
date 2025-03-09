<template>
  <div class="transparent-mask">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.transparent-mask {
  position: fixed;
  background-color: rgba($color: white, $alpha: 0);
  height: 100vh;
  width: 100%;
  left: 0;
  top: 0;
}
</style>
