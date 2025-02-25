<script lang="ts" setup>
import { ref } from 'vue'
import Checkbox from '@/components/CheckBox.vue'

const test = ref({ value: 111, isChecked: false })
</script>

<template>
  <div>
    <Checkbox v-model:value="test.value" v-model:is-checked="test.isChecked" :label="'test'" />
  </div>
</template>
