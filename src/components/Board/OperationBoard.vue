<script setup lang="ts">
import PopupComponent from '@/components/PopupComponent.vue'
import CustomInput from '@/components/CustomInput.vue'
import CrossImage from '@/components/Image/CrossImage.vue'
import SecondaryButton from '@/components/Button/SecondaryButton.vue'
import PrimarySButton from '@/components/Button/PrimarySButton.vue'
import type { IUpdateBoard } from '@/interfaces/board/IUpdateBoard'
import type { ICreateBoard } from '@/interfaces/board/ICreateBoard.ts'

const props = defineProps<{ function: () => object }>()

const board = defineModel<IUpdateBoard | ICreateBoard>('board')
const isShow = defineModel('isShow')

const remove = (index: number, board: IUpdateBoard | ICreateBoard) => board.columns.splice(index, 1)

const add = (board: IUpdateBoard | ICreateBoard) =>
  board.columns.push({
    id: null,
    name: '',
  })
</script>

<template>
  <PopupComponent v-if="isShow && board" @click="isShow = false">
    <div class="form" @click.stop>
      <span class="heading-l black">Edit Board</span>
      <CustomInput v-model:value="board!.name">
        <template v-slot:title>Name</template>
      </CustomInput>
      <div class="field">
        <span class="body-m medium-grey">Columns</span>
        <div class="item-container">
          <div class="item" v-for="(column, index) in board.columns" :key="index">
            <CustomInput v-model:value="column.name"></CustomInput>
            <CrossImage @click="remove(index, board)"></CrossImage>
          </div>
          <SecondaryButton @click="add(board)"> + Add New Column </SecondaryButton>
        </div>
      </div>
      <PrimarySButton @click="props.function"> Save Changes </PrimarySButton>
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
