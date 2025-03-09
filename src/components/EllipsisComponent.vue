<script setup lang="ts">
import { ref, nextTick } from 'vue'
import EllipsisImage from '@/components/Image/EllipsisImage.vue'
import TransparentMask from '@/components/TransparentMask.vue'

const props = defineProps({
  button1: { type: Object, default: () => null },
  button2: { type: Object, default: () => null },
})

const isShow = defineModel('isShow')

const ellipsis = ref<{ element: HTMLElement } | null>(null)

const tooltip: Ref<HTMLInputElement | undefined> = ref(undefined)

const hideTooltip = () => {
  isShow.value = !isShow.value
}

const open = () => {
  isShow.value = !isShow.value
  const ellipsisInfo = ellipsis.value?.element.getBoundingClientRect()

  if (ellipsisInfo) {
    nextTick(() => {
      if (tooltip.value) {
        tooltip.value.style.left = `${ellipsisInfo.left}px`
        tooltip.value.style.top = `${ellipsisInfo.top}px`
        tooltip.value.style.transform = 'translate(-100%,50%)'
      }
    })
  }
}
</script>

<template>
  <EllipsisImage @click.stop="open" ref="ellipsis"></EllipsisImage>
  <TransparentMask v-if="isShow" @click.stop="hideTooltip">
    <div class="tooltip" ref="tooltip" @click.stop>
      <ul class="content">
        <li v-if="props.button1" @click="props.button1.function">
          <span class="body-l medium-grey">{{ props.button1.text }}</span>
        </li>
        <li v-if="props.button2" @click="props.button2.function">
          <span class="body-l fire-opal">{{ props.button2.text }}</span>
        </li>
      </ul>
    </div>
  </TransparentMask>
</template>

<style lang="scss" scoped>
.tooltip {
  position: absolute;
  background-color: rgba($color: #364e7e, $alpha: 0.25);
  width: 192px;
  height: 94px;

  .content {
    cursor: pointer;
    width: 100%;
    height: 100%;
    background-color: white;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: center;
    padding-left: 16px;
  }
}
</style>
