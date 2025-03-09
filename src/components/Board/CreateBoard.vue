<script setup lang="ts">
import PopupComponent from '@/components/PopupComponent.vue'
import CustomInput from '@/components/CustomInput.vue'
import CrossImage from '@/components/Image/CrossImage.vue'
import SecondaryButton from '@/components/Button/SecondaryButton.vue'
import PrimarySButton from '@/components/Button/PrimarySButton.vue'
import { createBoardAsync } from '@/apis/kanbanapi.ts'
import type { ICreateBoard } from '@/interfaces/board/ICreateBoard.ts'
import { ref, type Ref } from 'vue'

const emit = defineEmits(['refresh'])

const board: Ref<ICreateBoard> = ref({
  name: '',
  memberId: 'e198e0d3-2dd5-431c-ac74-3f3d2f4db4cb',
  columns: [],
})
const isShow = defineModel('isShow')

const remove = (index: number) => board.value.columns.splice(index, 1)

const add = () =>
  board.value.columns.push({
    name: '',
  })

const create = async () => {
  try {
    await createBoardAsync(board.value)
    emit('refresh')
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <PopupComponent v-if="isShow" @click="isShow = false">
    <div class="form" @click.stop>
      <span class="heading-l black">Add New Board</span>
      <CustomInput v-model:value="board.name">
        <template v-slot:title>Name</template>
      </CustomInput>
      <div class="field">
        <span class="body-m medium-grey">Columns</span>
        <div class="item-container">
          <div class="item" v-for="(column, index) in board.columns" :key="index">
            <CustomInput v-model:value="column.name"></CustomInput>
            <CrossImage @click="remove(index)"></CrossImage>
          </div>
          <SecondaryButton @click="add"> + Add New Column </SecondaryButton>
        </div>
      </div>
      <PrimarySButton @click="create"> Create New Board </PrimarySButton>
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
