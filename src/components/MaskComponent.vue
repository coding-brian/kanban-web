<template>
  <div class="mask">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.mask {
  position: absolute;
  background-color: rgba($color: #000000, $alpha: 0.5);
  height: 100vh;
  width: 100%;
}
</style>
