<script lang="ts" setup>
import CustomInput from '@/components/CustomInput.vue'
</script>

<template>
  <div>
    <CustomInput>
      <template v-slot:title>title</template>
      <template v-slot:error-message>error-message</template>
    </CustomInput>
  </div>
</template>
