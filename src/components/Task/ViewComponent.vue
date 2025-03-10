<script setup lang="ts">
import { watch, ref, type Ref, computed } from 'vue'
import PopupComponent from '../PopupComponent.vue'
import { getTaskAsync, deleteTaskAsync, updateTaskAsync } from '@/apis/kanbanapi'
import type { ITask } from '@/interfaces/ITask'
import CheckBox from '../CheckBox.vue'
import DropdownComponent from '@/components/DropdownComponent.vue'
import type { IColumn } from '@/interfaces/IColumn'
import type { IOption } from '@/interfaces/IOption'
import { debounce } from 'lodash-es'
import FormComponent from './FormComponent.vue'
import type { ISubTask } from '@/interfaces/ISubTask'
import EllipsisComponent from '@/components/EllipsisComponent.vue'
import AlertComponent from '../AlertComponent.vue'

const props = defineProps<{
  taskId: string
  columns: IColumn[] | undefined
}>()

const emit = defineEmits(['refresh'])

const isShow = defineModel('isShow')

const task: Ref<ITask | undefined> = ref<ITask | undefined>(undefined)

const isShowTooltip: Ref<boolean> = ref(false)

const isShowAlert: Ref<boolean> = ref(false)

const isShowEdit: Ref<boolean> = ref(false)

const column = computed((): IColumn | null => {
  if (props.columns) {
    const column = props.columns.filter((item) => item.id === task.value?.columnId)
    if (column && column.length > 0) {
      return column[0]
    }
  }
  return null
})

const options = computed((): Array<IOption> => {
  if (column.value) {
    return [
      {
        id: column.value.id,
        name: column.value.name,
        value: column.value.id,
      },
    ]
  }
  return []
})

const openAlert = () => {
  isShowAlert.value = true
  isShowTooltip.value = false
}

const hide = () => {
  isShow.value = false
}

const openEditTask = () => {
  isShowEdit.value = true
}

const refresh = async (taskId: string) => {
  task.value = await getTaskAsync(taskId)
}

const deleteTask = debounce(async () => {
  try {
    await deleteTaskAsync(props.taskId)
    isShowAlert.value = false
    isShow.value = false
    emit('refresh')
  } catch (e) {
    console.error(e)
  }
}, 500)

const editTask = debounce(async () => {
  try {
    const { id } = await updateTaskAsync(task.value!)
    await refresh(id)
  } catch (e) {
    console.error(e)
  }
}, 500)

watch(
  () => props.taskId,
  async (newTaskId) => {
    if (newTaskId) {
      await refresh(newTaskId)
    } else {
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="view-container" v-if="isShow" @click.stop="hide">
    <PopupComponent v-if="task">
      <div class="container" @click.stop>
        <div class="title-container">
          <span class="heading-l">{{ task.title }}</span>
          <EllipsisComponent
            v-model:is-show="isShowTooltip"
            :button1="{ text: 'Edit Task', function: openEditTask }"
            :button2="{ text: 'Delete Task', function: openAlert }"
          ></EllipsisComponent>
        </div>
        <span class="body-l medium-grey">{{ task.description }}</span>
        <div class="subtask-container">
          <span class="body-m medium-grey">
            Subtasks ({{ (task.subTasks as ISubTask[]).filter((item) => item.isCompleted).length }})
            of {{ task.subTasks.length }}</span
          >
          <div class="item-wrapper">
            <CheckBox
              v-for="subTask in task.subTasks"
              :key="subTask.id!"
              :label="subTask.title"
              :is-checked="(subTask as ISubTask).isCompleted"
              :value="subTask.id!"
              :disable="true"
            ></CheckBox>
          </div>
        </div>
        <DropdownComponent
          :options="options"
          :default-option="options[0]"
          v-model:value="task.columnId"
          :disabled="true"
        >
          <template v-slot:title>Current Status</template>
        </DropdownComponent>
      </div>
    </PopupComponent>
    <AlertComponent
      v-model:is-show="isShowAlert"
      :button1="{
        text: 'Delete',
        function: deleteTask,
      }"
      :button2="{
        text: 'Cancel',
        function: () => {
          isShowAlert = false
        },
      }"
    >
      <template v-slot:title>Delete this task?</template>
      <template v-slot:content
        >Are you sure you want to delete the {{ task?.title }} task? This action will remove all
        subtasks and cannot be reversed.</template
      >
    </AlertComponent>
    <FormComponent
      v-model:is-show="isShowEdit"
      v-model:task="task"
      :columns="columns"
      :button-function="editTask"
    >
      <template v-slot:title>Edit Task</template>
      <template v-slot:button-name>Save Changes</template>
    </FormComponent>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 480px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;

  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .subtask-container {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .item-wrapper {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
}

.view-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
