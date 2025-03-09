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
import CardComponent from '@/components/CardComponent.vue'
import ViewComponent from '@/components/Task/ViewComponent.vue'
import type { IColumn } from '@/interfaces/IColumn'
import type { ITask } from '@/interfaces/ITask'
import FormComponent from '@/components/Task/FormComponent.vue'
import EllipsisComponent from '@/components/EllipsisComponent.vue'
import CreateBoard from '@/components/Board/CreateBoard.vue'
import type { ISubTask } from '@/interfaces/ISubTask'

const boards: Ref<Array<IBoard>> = ref([])

const board: Ref<IBoard | null> = ref(null)

const taskCreation: Ref<ITask> = ref({
  id: '',
  boardId: '',
  columnId: '',
  title: '',
  description: '',
  subTasks: [],
})

const isShowCreateTaks: Ref<boolean> = ref(false)

const isShowTask: Ref<boolean> = ref(false)

const isShowTooltip: Ref<boolean> = ref(false)

const isShowCreateBoard: Ref<boolean> = ref(false)

const selectedTaskId: Ref<string> = ref('')

const selectedColumn: Ref<IColumn | null> = ref(null)

const hasColumns = computed(
  () => board.value && board.value.columns && board.value.columns.length > 0,
)

const createTask = debounce(async () => {
  try {
    taskCreation.value.boardId = board.value!.id
    await createTaskAsync(taskCreation.value)
    isShowCreateTaks.value = false
    await refreshBoardById()
  } catch (error) {
    console.error(error)
  }
}, 500)

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

const refreshBoardById = async (): Promise<void> => {
  if (board.value) {
    board.value = await getBoardByIdAsync(board.value.id)
  }
}

const refreshAside = async () => {
  await init()
  isShowCreateBoard.value = false
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

const buttons = [
  {
    text: 'Edit Board',
    function: () => {},
  },
  {
    text: 'Delete Board',
    function: () => {},
  },
]

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
      <EllipsisComponent
        v-model:is-show="isShowTooltip"
        :button1="buttons[0]"
        :button2="buttons[1]"
      ></EllipsisComponent>
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
        <li class="item" @click="isShowCreateBoard = true">
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
            task.subTasks.filter((item) => (item as ISubTask).isCompleted).length
          }}</template>
          <template v-slot:totle-substasks>{{ task.subTasks.length }}</template>
        </CardComponent>
      </div>
      <div class="add-new-column">
        <span class="heading-xl">+ New Column</span>
      </div>
    </template>
  </main>
  <FormComponent
    v-model:is-show="isShowCreateTaks"
    v-model:task="taskCreation"
    :columns="board?.columns"
    :button-function="createTask"
  >
    <template v-slot:title>Add New Task</template>
    <template v-slot:button-name>Create Task</template>
  </FormComponent>
  <ViewComponent
    v-model:is-show="isShowTask"
    :task-id="selectedTaskId"
    :columns="board?.columns"
    @refresh="refreshBoardById"
  />
  <CreateBoard v-model:is-show="isShowCreateBoard" @refresh="refreshAside"></CreateBoard>
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
}

.hide-sidebar {
  display: flex;
  gap: 8px;

  span {
    @extend %heading-m;
    color: $medium-grey;
  }
}
</style>
