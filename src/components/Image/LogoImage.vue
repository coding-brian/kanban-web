<script setup lang="ts">
import DarkLogo from '@/assets/images/logo-dark.svg'
import LightLogo from '@/assets/images/logo-light.svg'
import { useDark } from '@vueuse/core'

const isDark = useDark()
</script>

<template>
  <img :src="isDark ? LightLogo : DarkLogo" alt="" srcset="" />
</template>
