<template>
  <div class="transparent-mask">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.transparent-mask {
  position: absolute;
  background-color: rgba($color: white, $alpha: 0);
  height: 100vh;
  width: 100%;
}
</style>
