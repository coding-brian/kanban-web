<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
  placeholder: { type: String, default: null },
  validate: { type: Function, default: null },
  isTextarea: { type: Boolean, default: false },
})

const value = defineModel('value')

const inputContainer = ref()

const change = (e: Event) => {
  const target = e.target as HTMLInputElement
  inputContainer.value.classList.remove('error')
  value.value = target.value
}

const validate = () => {
  if (props.validate) props.validate()
}
</script>

<template>
  <div class="container" ref="inputContainer">
    <span class="title">
      <slot name="title"></slot>
    </span>
    <div class="wrapper">
      <template v-if="props.isTextarea">
        <textarea
          class="area"
          :value="value"
          @input="change"
          :placeholder="props.placeholder"
          @blur="validate"
        ></textarea>
      </template>
      <template v-else>
        <input
          class="area"
          type="text"
          :value="value"
          @input="change"
          :placeholder="props.placeholder"
          @blur="validate"
        />
      </template>

      <span class="error-message"><slot name="error-message"></slot></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  @extend %body-l;

  color: black;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .area {
    width: 100%;
    border: 1px rgba($color: $medium-grey, $alpha: 0.25) solid;
    border-radius: 4px;
    outline: none;
    padding-left: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  textarea.area {
    min-height: 112px;
  }

  .title {
    font-size: 12px;
    font-weight: bold;
    color: $medium-grey;
  }

  .title:empty {
    display: none;
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
  .wrapper {
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
