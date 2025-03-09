<script setup lang="ts">
import { ref, defineExpose, type Ref } from 'vue'
import EllipsisImage from '@/assets/images/icon-vertical-ellipsis.svg'

const element: Ref<HTMLInputElement | undefined> = ref(undefined)

defineExpose({
  element,
})
</script>

<template>
  <img :src="EllipsisImage" ref="element" />
</template>

<style scoped lang="scss">
img {
  cursor: pointer;
}
</style>
