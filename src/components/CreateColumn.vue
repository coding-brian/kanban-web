<script setup lang="ts">
import PopupComponent from '@/components/PopupComponent.vue'
import type { ICreateColumn } from '@/interfaces/column/ICreateColumn'
import CustomInput from '@/components/CustomInput.vue'
import CrossImage from '@/components/Image/CrossImage.vue'
import SecondaryButton from '@/components/Button/SecondaryButton.vue'
import PrimarySButton from '@/components/Button/PrimarySButton.vue'

const props = defineProps<{ boardId: string; function: () => object }>()

const isShow = defineModel('isShow')
const columns = defineModel<ICreateColumn[]>('columns')

const remove = (index: number, columns: ICreateColumn[] | undefined) => columns!.splice(index, 1)

const add = (columns: ICreateColumn[] | undefined) =>
  columns!.push({
    boardId: props.boardId,
    name: '',
  })
</script>

<template>
  <PopupComponent v-if="isShow" @click="isShow = false">
    <div class="form" @click.stop>
      <span class="heading-l black">Add New Columns</span>
      <div class="field">
        <span class="body-m medium-grey">Columns</span>
        <div class="item-container">
          <div class="item" v-for="(column, index) in columns" :key="index">
            <CustomInput v-model:value="column.name"></CustomInput>
            <CrossImage @click="remove(index, columns)"></CrossImage>
          </div>
          <SecondaryButton @click="add(columns)"> + Add New Column </SecondaryButton>
        </div>
      </div>
      <PrimarySButton @click="props.function"> Create Column </PrimarySButton>
    </div>
  </PopupComponent>
</template>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  min-width: 480px;

  img {
    cursor: pointer;
  }

  .description {
    input {
      height: 1000px;
    }
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .item-container {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .item {
        display: flex;
        align-items: center;
        gap: 16px;

        & > :first-child {
          flex-grow: 1;
        }
      }
    }
  }
}
</style>
