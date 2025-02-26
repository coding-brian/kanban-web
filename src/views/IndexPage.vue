<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import DrowndownComponent from '@/components/DrowndownComponent.vue'
import { type IOption } from '@/interfaces/Option'

const options: Ref<Array<IOption>> = ref([
  { id: '1', name: '4', value: '11' },
  { id: '2', name: '2', value: '22' },
])
const value: Ref<string> = ref('')
</script>

<template>
  <div>
    <DrowndownComponent v-model:value="value" :options="options"></DrowndownComponent>
  </div>
</template>
