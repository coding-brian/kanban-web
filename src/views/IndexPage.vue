<script lang="ts" setup>
import { computed, onMounted, ref, type Ref } from 'vue'
import LogoImage from '@/components/Image/LogoImage.vue'
import { type IBoard } from '@/interfaces/IBoard'
import DarkImage from '@/components/Image/DarkImage.vue'
import LightImage from '@/components/Image/LightImage.vue'
import ToggleCompnent from '@/components/ToggleComponent.vue'
import HideSidebarImage from '@/components/Image/HideSidebarImage.vue'
import { getBoardAsync, getBoardByIdAsync, createTaskAsync } from '@/apis/kanbanapi.ts'
import { debounce } from 'lodash-es'
import PrimaryLButton from '@/components/Button/PrimaryLButton.vue'
import PrimarySButton from '@/components/Button/PrimarySButton.vue'
import EellipsisImage from '@/components/Image/EellipsisImage.vue'
import CardComponent from '@/components/CardComponent.vue'
import PopupComponent from '@/components/PopupComponent.vue'
import CustomInput from '@/components/CustomInput.vue'
import CrossImage from '@/components/Image/CrossImage.vue'
import SecondaryButton from '@/components/Button/SecondaryButton.vue'
import DropdownComponent from '@/components/DropdownComponent.vue'
import type { IOption } from '@/interfaces/IOption'
import type { ICreateTask } from '@/interfaces/task/ICreateTask'
import ViewComponent from '@/components/Task/ViewComponent.vue'
import type { IColumn } from '@/interfaces/IColumn'
import type { ITask } from '@/interfaces/ITask'

const boards: Ref<Array<IBoard>> = ref([])

const board: Ref<IBoard | null> = ref(null)

const taskCreation: Ref<ICreateTask> = ref({
  boardId: '',
  title: '',
  description: '',
  columnId: '',
  subTasks: [],
})

const isShowCreateTaks: Ref<boolean> = ref(false)

const isShowTask: Ref<boolean> = ref(false)

const selectedTaskId: Ref<string> = ref('')

const selectedColumn: Ref<IColumn | null> = ref(null)

const hasColumns = computed(
  () => board.value && board.value.columns && board.value.columns.length > 0,
)

const options = computed(() => {
  const result: Array<IOption> = []
  if (!board.value) {
    return result
  }
  board.value.columns.forEach((item) => {
    result.push({ id: item.id, name: item.name, value: item.id })
  })
  return result
})

const createTask = debounce(async () => {
  try {
    taskCreation.value.boardId = board.value!.id
    await createTaskAsync(taskCreation.value)
    isShowCreateTaks.value = false
  } catch (error) {
    console.error(error)
  }
}, 500)

const addSubTask = () => taskCreation.value.subTasks.push({ title: '' })

const removeSubTask = (index: number) => taskCreation.value.subTasks.splice(index, 1)

const enter = (board: IBoard): void => {
  if (!board.isSelected) {
    board.imageSrc = '/icon-purple-board.svg'
  }
}

const leave = (board: IBoard): void => {
  if (!board.isSelected) {
    board.imageSrc = '/icon-board.svg'
  }
}

const click = async (selectedBoard: IBoard): Promise<void> => {
  boards.value.forEach((item) => {
    if (item.id === selectedBoard.id) {
      item.isSelected = true
      item.imageSrc = '/icon-white-board.svg'
    } else {
      item.isSelected = false
      item.imageSrc = '/icon-board.svg'
    }
  })

  board.value = await getBoardByIdAsync(selectedBoard.id)
}

const init = async (): Promise<void> => {
  boards.value = await getBoardAsync()
  boards.value.forEach((item, index) => {
    if (index === 0) {
      item.imageSrc = '/icon-white-board.svg'
      item.isSelected = true
      board.value = item
    } else {
      item.imageSrc = '/icon-board.svg'
      item.isSelected = false
    }
  })
}

const hidePopup = () => {
  isShowCreateTaks.value = false
  isShowTask.value = false
}

const openTask = (task: ITask) => {
  isShowTask.value = true
  selectedTaskId.value = task.id

  if (board.value) {
    for (const column of board.value.columns) {
      if (column.id === task.columnId) {
        selectedColumn.value = column
        break
      }
    }
  }
}

onMounted(async () => await init())
</script>

<template>
  <header>
    <span class="heading-xl">{{ board?.name }}</span>
    <div>
      <PrimaryLButton
        :class="{ 'opacity-25': hasColumns ? false : true }"
        :disabled="hasColumns ? false : true"
        @click="isShowCreateTaks = true"
      >
        <span>+ Add New Task</span>
      </PrimaryLButton>
      <EellipsisImage></EellipsisImage>
    </div>
  </header>
  <aside>
    <div class="logo">
      <LogoImage />
    </div>
    <nav>
      <span class="nav-title">ALL BOARDS ({{ boards.length }})</span>
      <ul>
        <li
          class="item"
          :class="{ active: board.isSelected }"
          v-for="board in boards"
          @mouseenter="enter(board)"
          @mouseleave="leave(board)"
          @click="click(board)"
          :key="board.id"
        >
          <img :src="board.imageSrc" alt="" srcset="" />
          <span class="item-title">{{ board.name }}</span>
        </li>
        <li class="item">
          <img src="/icon-purple-board.svg" alt="" srcset="" />
          <span class="item-title">+ Create New Board</span>
        </li>
      </ul>
    </nav>
    <div class="aside-footer">
      <div class="mode-toggle">
        <LightImage />
        <ToggleCompnent />
        <DarkImage />
      </div>
      <div class="hide-sidebar">
        <HideSidebarImage />
        <span>Hide Sidebar</span>
      </div>
    </div>
  </aside>
  <main>
    <template v-if="!hasColumns">
      <div class="empty-container">
        <span class="heading-l">This board is empty. Create a new column to get started.</span>
        <PrimaryLButton>
          <span>+ Add New Column</span>
        </PrimaryLButton>
      </div>
    </template>

    <template v-if="hasColumns">
      <div class="column" v-for="column in board?.columns" :key="column.id">
        <span class="heading-s">{{ column.name }} ({{ column.tasks.length }})</span>
        <CardComponent v-for="task in column.tasks" :key="task.id" @click="openTask(task)">
          <template v-slot:title>{{ task.title }}</template>
          <template v-slot:completed-substasks>{{
            task.subTasks.filter((item) => item.isCompleted).length
          }}</template>
          <template v-slot:totle-substasks>{{ task.subTasks.length }}</template>
        </CardComponent>
      </div>
      <div class="add-new-column">
        <span class="heading-xl">+ New Column</span>
      </div>
    </template>
  </main>
  <PopupComponent v-if="isShowCreateTaks" @click="hidePopup">
    <div class="add-new-task-container" @click.stop>
      <span class="heading-l black"> Add New Task</span>
      <CustomInput :placeholder="'e.g Take coffee break'" v-model:value="taskCreation.title">
        <template v-slot:title>
          <span>Title</span>
        </template>
      </CustomInput>
      <CustomInput
        class="description"
        v-model:value="taskCreation.description"
        :isTextarea="true"
        :placeholder="'e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little.'"
      >
        <template v-slot:title>
          <span>Description</span>
        </template>
      </CustomInput>
      <div class="add-new-subtask-container">
        <span class="body-m medium-grey">SubTasks</span>
        <div class="subtask">
          <div class="subtask-item" v-for="(subTask, index) in taskCreation.subTasks" :key="index">
            <CustomInput v-model:value="subTask.title"> </CustomInput>
            <CrossImage @click="removeSubTask(index)" />
          </div>
          <SecondaryButton @click="addSubTask"> + Add New Subtask </SecondaryButton>
        </div>
      </div>
      <DropdownComponent :options="options" v-model:value="taskCreation.columnId">
        <template v-slot:title>Status</template>
      </DropdownComponent>

      <PrimarySButton @click="createTask">
        <span>Create Task</span>
      </PrimarySButton>
    </div>
  </PopupComponent>
  <ViewComponent
    v-model:is-show="isShowTask"
    :task-id="selectedTaskId"
    :column="selectedColumn"
  ></ViewComponent>
</template>

<style lang="scss" scoped>
header {
  border: 1px $light-lines solid;
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 24px;
  padding-right: 24px;

  & > span {
    cursor: default;
  }

  & > div {
    display: flex;
    gap: 24px;

    & > img {
      object-fit: contain;
    }
  }
}

aside {
  border: 1px $light-lines solid;
  grid-area: aside;
  display: flex;
  flex-direction: column;
  padding-top: 32px;
  padding-bottom: 32px;

  .aside-footer {
    margin-left: 32px;
    margin-right: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}

main {
  border: 1px $light-lines solid;
  grid-area: main;
  background-color: $light-grey;
  overflow: auto;
  display: flex;
  gap: 24px;
  padding: 24px 0px 24px 24px;

  .empty-container {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    color: $medium-grey;
    flex-shrink: 1;
  }

  .add-new-column {
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to bottom, #e9effa 100%, #e9effa 50%);
    padding-left: 55px;
    padding-right: 55px;
    cursor: pointer;

    span {
      color: $medium-grey;
    }
  }

  .column {
    display: flex;
    gap: 24px;
    flex-direction: column;
    width: 280px;

    span {
      color: $medium-grey;
    }
  }

  & > * {
    flex-shrink: 0;
  }
}

.logo {
  display: flex;
  align-items: center;
  margin-bottom: 54px;
  margin-left: 32px;
}

nav {
  flex: 1;

  .nav-title {
    display: block;
    font-size: 12px;
    font-weight: blod;
    letter-spacing: 2.4px;
    color: $medium-grey;
    padding-left: 32px;
    margin-bottom: 16px;
  }

  li {
    cursor: pointer;
    width: 240px;
    height: 48px;
    display: flex;
    gap: 16px;
    align-items: center;
    padding-left: 32px;

    &.item {
      .item-title {
        @extend %heading-m;
        color: $medium-grey;
        white-space: nowrap; /* 文字不換行 */
        overflow: hidden; /* 隱藏超出部分 */
        text-overflow: ellipsis; /* 顯示省略號 */
      }

      &:hover {
        background-color: rgba($color: $main-purple, $alpha: 0.1);
        border-top-right-radius: 100px;
        border-bottom-right-radius: 100px;
        .item-title {
          @extend %heading-m;
          color: $main-purple;
        }
      }

      &.active {
        background-color: $main-purple;
        border-top-right-radius: 100px;
        border-bottom-right-radius: 100px;

        .item-title {
          @extend %heading-m;
          color: white;
        }
      }
    }
  }
}

.mode-toggle {
  border-radius: 6px;
  background-color: $light-grey;
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 16px;
  padding-bottom: 16px;

  img {
    object-fit: contain;
  }
}

.hide-sidebar {
  display: flex;
  gap: 8px;

  span {
    @extend %heading-m;
    color: $medium-grey;
  }
}

.add-new-task-container {
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

  .add-new-subtask-container {
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

      .add-new-subtask-button-name {
        font-weight: 500;
      }
    }
  }
}
</style>
