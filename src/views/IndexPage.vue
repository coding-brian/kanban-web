<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import DrowndownComponent from '@/components/DrowndownComponent.vue'
import { type IOption } from '@/interfaces/Option'
import CardComponent from '@/components/CardComponent.vue'
import PopupComponent from '@/components/PopupComponent.vue'

// const options: Ref<Array<IOption>> = ref([
//   { id: '1', name: '4', value: '11' },
//   { id: '2', name: '2', value: '22' },
// ])
// const value: Ref<string> = ref('')
</script>

<template>
  <PopupComponent> </PopupComponent>
  <div>
    <!-- <DrowndownComponent v-model:value="value" :options="options"></DrowndownComponent> -->
    <CardComponent></CardComponent>
  </div>
</template>
