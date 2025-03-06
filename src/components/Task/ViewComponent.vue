<script setup lang="ts">
import { watch, ref, type Ref, computed, nextTick } from 'vue'
import PopupComponent from '../PopupComponent.vue'
import { getTaskAsync } from '@/apis/kanbanapi'
import type { ITask } from '@/interfaces/ITask'
import CheckBox from '../CheckBox.vue'
import DropdownComponent from '@/components/DropdownComponent.vue'
import type { IColumn } from '@/interfaces/IColumn'
import type { IOption } from '@/interfaces/IOption'
import EellipsisImage from '@/components/Image/EellipsisImage.vue'
import TransparentMask from '../TransparentMask.vue'

const props = defineProps<{ taskId: string; column: IColumn }>()

const task: Ref<ITask | null> = ref<ITask | null>(null)

const isShowTooltip: Ref<boolean> = ref(false)

const tooltip: Ref<HTMLInputElement | undefined> = ref(undefined)

const ellipsis = ref<{ element: HTMLElement } | null>(null)

const options = computed(
  (): Array<IOption> => [
    {
      id: props.column.id,
      name: props.column.name,
      value: props.column.id,
    },
  ],
)

const openToolTip = () => {
  isShowTooltip.value = !isShowTooltip.value
  const ellipsisInfo = ellipsis.value?.element.getBoundingClientRect()
  if (ellipsisInfo) {
    nextTick(() => {
      if (tooltip.value) {
        tooltip.value.style.left = `${ellipsisInfo.right}px`
        tooltip.value.style.top = `${ellipsisInfo.top}px`
        tooltip.value.style.transform = 'translate(-50%,50%)'
        console.log(tooltip.value.style.transform)
      }
    })
  }
}

const hideTooltip = () => {
  isShowTooltip.value = !isShowTooltip.value
}

watch(
  () => props.taskId,
  async (newTaskId) => {
    if (newTaskId) {
      task.value = await getTaskAsync(newTaskId)
    } else {
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="view-container">
    <PopupComponent v-if="task">
      <div class="container" @click.stop>
        <div class="title-container">
          <span class="heading-l">{{ task.title }}</span>
          <EellipsisImage @click="openToolTip" ref="ellipsis"></EellipsisImage>
        </div>
        <span class="body-l medium-grey">{{ task.description }}</span>
        <div class="subtask-container">
          <span class="body-m medium-grey">
            Subtasks ({{ task.subTasks.filter((item) => item.isCompleted).length }}) of
            {{ task.subTasks.length }}</span
          >
          <div class="item-wrapper">
            <CheckBox
              v-for="subTask in task.subTasks"
              :key="subTask.id"
              :label="subTask.title"
              :is-checked="subTask.isCompleted"
              :value="subTask.id"
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
    <TransparentMask v-if="isShowTooltip" @click.stop="hideTooltip">
      <div class="tooltip" ref="tooltip" @click.stop>
        <ul class="content">
          <li><span class="body-l medium-grey">Edit Task</span></li>
          <li><span class="body-l fire-opal">Delete Task</span></li>
        </ul>
      </div>
    </TransparentMask>
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

.tooltip {
  position: absolute;
  background-color: rgba($color: #364e7e, $alpha: 0.25);
  width: 192px;
  height: 94px;

  .content {
    width: 100%;
    height: 100%;
    background-color: white;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: center;
    padding-left: 16px;
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
