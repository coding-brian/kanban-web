<script setup lang="ts">
import type { IColumn } from '@/interfaces/IColumn'
import type { IOption } from '@/interfaces/IOption'
import type { ITask } from '@/interfaces/ITask'
import { computed } from 'vue'
import PopupComponent from '@/components/PopupComponent.vue'
import CustomInput from '@/components/CustomInput.vue'
import CrossImage from '@/components/Image/CrossImage.vue'
import SecondaryButton from '@/components/Button/SecondaryButton.vue'
import DropdownComponent from '@/components/DropdownComponent.vue'
import PrimarySButton from '@/components/Button/PrimarySButton.vue'
import type { IUpdateSubTask } from '@/interfaces/subtask/IUpdateSubTask'

const props = defineProps<{ columns: IColumn[] | undefined; buttonFunction: () => object }>()

const isShow = defineModel('isShow')

const task = defineModel<ITask>('task')

const options = computed(() => {
  const result: Array<IOption> = []
  if (!props.columns) {
    return result
  }

  props.columns.forEach((item) => {
    result.push({ id: item.id, name: item.name, value: item.id })
  })

  return result
})

const defaultOption = computed((): IOption | undefined => {
  if (!props.columns) {
    return undefined
  }
  if (task.value?.columnId) {
    const column = props.columns.filter((item) => item.id === task.value?.columnId)[0]

    return { id: column.id, name: column.name, value: column.id }
  }

  return undefined
})

const removeSubTask = (index: number, task: ITask) => task.subTasks.splice(index, 1)

const addSubTask = (task: ITask) =>
  (task.subTasks as IUpdateSubTask[]).push({
    id: null,
    taskId: task.id,
    title: '',
  })
</script>

<template>
  <PopupComponent v-if="task && isShow" @click="isShow = false">
    <div class="form-container" @click.stop>
      <span class="heading-l black"> <slot name="title"></slot></span>
      <CustomInput :placeholder="'e.g Take coffee break'" v-model:value="task.title">
        <template v-slot:title>
          <span>Title</span>
        </template>
      </CustomInput>
      <CustomInput
        class="description"
        v-model:value="task.description"
        :isTextarea="true"
        :placeholder="'e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little.'"
      >
        <template v-slot:title>
          <span>Description</span>
        </template>
      </CustomInput>
      <div class="field">
        <span class="body-m medium-grey">SubTasks</span>
        <div class="subtask">
          <div class="subtask-item" v-for="(subTask, index) in task.subTasks" :key="index">
            <CustomInput v-model:value="subTask.title"> </CustomInput>
            <CrossImage @click="removeSubTask(index, task)" />
          </div>
          <SecondaryButton @click="addSubTask(task)"> + Add New Subtask </SecondaryButton>
        </div>
      </div>
      <DropdownComponent
        :options="options"
        v-model:value="task.columnId"
        :default-option="defaultOption"
      >
        <template v-slot:title>Status</template>
      </DropdownComponent>

      <PrimarySButton @click="buttonFunction"> <slot name="button-name"></slot> </PrimarySButton>
    </div>
  </PopupComponent>
</template>

<style lang="scss" scoped>
.form-container {
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

    .subtask {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .subtask-item {
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
