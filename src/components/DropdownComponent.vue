<script setup lang="ts">
import { nextTick, ref, watch, type Ref } from 'vue'
import { type IOption } from '@/interfaces/IOption'

const props = defineProps<{
  options: Array<IOption>
  defaultOption?: IOption
  disabled?: boolean
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
  if (props.disabled !== undefined && props.disabled !== null) {
    if (props.disabled === true) isOptionShow.value = false
  }

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
  <div class="dropdown-container" @blur="blur" tabindex="0" :class="{ disable: props.disabled }">
    <span class="title"><slot name="title"></slot></span>
    <div>
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
  </div>
</template>

<style lang="scss" scoped>
.dropdown-container {
  .title {
    @extend %body-m;
    color: $medium-grey;
  }

  display: flex;
  flex-direction: column;
  gap: 8px;
  & > span:empty {
    display: none;
  }
  cursor: pointer;

  &.disable {
    cursor: default;
  }

  .select {
    @extend %body-l;
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
}

.dark {
  .dropdown-container {
    color: white;

    .select {
      color: white;
      background-color: rgba($color: $dark-grey, $alpha: 1);
    }

    .title {
      color: white;
    }

    .option-group {
      background-color: rgba($color: $very-dark-grey, $alpha: 1);
      border-radius: 8px;

      ul {
        color: $medium-grey;
        background-color: rgba($color: $very-dark-grey, $alpha: 1);
      }
    }
  }
}
</style>
