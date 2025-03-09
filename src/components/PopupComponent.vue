<script setup lang="ts">
import MaskComponent from './MaskComponent.vue'
</script>

<template>
  <MaskComponent class="popup">
    <div class="popup-container">
      <slot></slot>
    </div>
  </MaskComponent>
</template>

<style scoped lang="scss">
.popup-container {
  background-color: white;
  border-radius: 6px;
}

.popup {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
