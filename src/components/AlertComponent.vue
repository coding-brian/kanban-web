<script setup lang="ts">
import PopupComponent from '@/components/PopupComponent.vue'

const props = defineProps({
  button1: { type: Object, defauult: () => {} },
  button2: { type: Object, defauult: () => {} },
})

const isShow = defineModel('isShow')
</script>
<template>
  <PopupComponent v-if="isShow" @click.stop="isShow = false">
    <div class="alert-container">
      <span class="fire-opal heading-l"><slot name="title"></slot></span>
      <span class="body-l medium-grey"><slot name="content"></slot></span>
      <div class="button-group">
        <DestructiveButton v-if="props.button1" @click="props.button1.function">
          {{ props.button1.text }}
        </DestructiveButton>
        <SecondaryButton v-if="props.button2" @click="props.button2.function">
          {{ props.button2.text }}
        </SecondaryButton>
      </div>
    </div>
  </PopupComponent>
</template>

<style scoped lang="scss">
.alert-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  width: 480px;

  .button-group {
    display: flex;
    gap: 16px;

    & > button {
      flex-grow: 1;
    }
  }
}
</style>
