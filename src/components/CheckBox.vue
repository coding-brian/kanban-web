<script lang="ts" setup>
import { ref, type Ref } from 'vue'

const props = defineProps({
  value: { type: [Number, String], default: null },
  isChecked: { type: Boolean, default: false },
  label: { type: [Number, String], default: null },
  placeholder: { type: String, default: null },
  disable: { type: Boolean, default: false },
})

const emit = defineEmits(['update:value', 'update:isChecked'])

const inputContainer: Ref<HTMLInputElement | undefined> = ref(undefined)

const changeByElement = (value: string | number) => {
  if (inputContainer.value) {
    inputContainer.value.checked = !inputContainer.value.checked
    emit('update:isChecked', inputContainer.value.checked)
  }
  emit('update:value', value)
}

const change = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (inputContainer.value) {
    inputContainer.value.classList.remove('error')
  }

  changeByElement(parseInt(target.value, 10))
}
</script>

<template>
  <div class="input-container" ref="inputContainer" @click.capture="changeByElement(props.value)">
    <input
      :id="props.value?.toString()"
      type="checkbox"
      :value="value"
      :placeholder="props.placeholder"
      :checked="props.isChecked"
      :disabled="props.disable"
      @input="change"
    />
    <label :for="value?.toString()">{{ props.label }}</label>
  </div>
</template>

<style lang="scss" scoped>
.input-container {
  width: 100%;
  background-color: $light-grey;
  display: flex;
  align-items: center;
  padding-left: 16px;
  padding-top: 16px;
  padding-bottom: 16px;
  border-radius: 4px;

  &:has(input:not(:disabled)),
  &:has(input:not(:disabled)) > * {
    cursor: pointer;
  }

  &:has(input:not(:disabled)):has(input:not(:checked)):hover {
    background-color: rgba($color: $main-purple, $alpha: 0.25);
  }

  input {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 2px;
    margin: 0;
    background-color: white;
    border: 1px rgba($color: $medium-grey, $alpha: 0.24) solid;

    &:checked {
      width: 16px;
      height: 16px;
      background-color: $main-purple;

      &::after {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        background-image: url('@/assets/images/icon-check.svg');
        background-repeat: no-repeat;
        background-position: center;
      }

      & + label {
        text-decoration: line-through;
        opacity: 0.5;
      }
    }
  }

  label {
    font-size: 12px;
    font-weight: bold;
    margin-left: 16px;
  }
}
</style>
