<script setup lang="ts">
import MaskComponent from './MaskComponent.vue'
</script>

<template>
  <MaskComponent>
    <div class="popup-container">
      <slot></slot>
    </div>
  </MaskComponent>
</template>

<style scoped>
.popup-container {
  display: inline-block;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 6px;
}
</style>
