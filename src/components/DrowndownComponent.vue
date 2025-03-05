<script setup lang="ts">
import { nextTick, ref, watch, type Ref } from 'vue'
import { type IOption } from '@/interfaces/IOption'

const props = defineProps<{
  options: Array<IOption>
  defaultOption?: IOption
}>()

const value = defineModel('value')
const chooseName = ref('')
const isOptionShow = ref(false)
const selectElement: Ref<HTMLInputElement | undefined> = ref(undefined)

const choose = (option: IOption) => {
  value.value = option.value
  chooseName.value = option.name
  changeSelectStyle()
}

const blur = () => {
  if (isOptionShow.value) {
    changeSelectStyle()
  }
}

const changeSelectStyle = () => {
  isOptionShow.value = !isOptionShow.value
  if (isOptionShow.value) {
    selectElement.value!.style.borderColor = '#635fc7'
  } else {
    selectElement.value!.style.borderColor = 'rgba(130, 143, 163,0.25)'
  }
}

watch(
  () => props.defaultOption,
  (newValue) => {
    if (newValue) {
      nextTick(() => {
        choose(newValue)
        isOptionShow.value = false
      })
    }
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div class="container" @blur="blur" tabindex="0">
    <div class="select" @click="changeSelectStyle" ref="selectElement">
      <span>{{ chooseName }}</span>
      <img :src="'/icon-chevron-down.svg'" v-if="!isOptionShow" />
      <img :src="'/icon-chevron-up.svg'" v-else />
    </div>
    <div class="option-group" v-if="isOptionShow">
      <ul>
        <li
          class="option"
          @click.stop="choose(option)"
          v-for="option in props.options"
          :key="option.id"
        >
          <span>{{ option.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select {
  @extend %body-l;

  cursor: pointer;
  appearance: none;
  border: 1px solid;
  border-color: rgba($color: $medium-grey, $alpha: 0.25);
  border-radius: 4px;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 23px;
  align-items: center;

  img {
    object-fit: contain;
    justify-self: end;
  }
}

.option-group {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: rgba($color: #364e7e, $alpha: 0.25);
  margin-top: 8px;
  display: flex;
  align-items: center;

  ul {
    @extend %body-l;

    color: $medium-grey;
    width: 100%;
    border: 1px;
    padding-top: 16px;
    padding-bottom: 16px;
    background-color: white;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    li {
      cursor: pointer;
      padding-left: 16px;

      &:hover {
        background-color: $main-purple-hover;
      }
    }
  }
}
</style>
