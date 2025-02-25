<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
  value: { type: String, default: null },
  placeholder: { type: String, default: null },
  validate: { type: Function, default: null },
})
const emit = defineEmits(['update:value'])

const inputContainer = ref()

const change = (e: Event) => {
  const target = e.target as HTMLInputElement
  inputContainer.value.classList.remove('error')
  emit('update:value', target.value)
}

const validate = () => {
  if (props.validate) props.validate()
}
</script>

<template>
  <div class="input-container" :ref="inputContainer">
    <span class="title">
      <slot name="title"></slot>
    </span>
    <div class="input-wrapper">
      <input
        type="text"
        :value="props.value"
        @input="change"
        :placeholder="props.placeholder"
        @blur="validate"
      />
      <span class="error-message"><slot name="error-message"></slot></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-container {
  @extend %body-l;

  color: black;
  display: flex;
  flex-direction: column;
  gap: 8px;

  input {
    width: 100%;
    border: 1px rgba($color: $medium-grey, $alpha: 0.25) solid;
    border-radius: 4px;
    outline: none;
  }

  .title {
    font-size: 12px;
    font-weight: bold;
    color: $medium-grey;
  }

  &::placeholder {
    @extend %body-l;
    @extend %opacity-25;
    color: black;
  }

  .error-message {
    display: none;
  }
}

.error {
  .input-wrapper {
    position: relative;

    input {
      border-color: $fire-opal;
    }
  }

  .error-message {
    display: inline;
    position: absolute;
    right: 16px;
    top: 0px;
    color: $fire-opal;
  }
}
</style>
