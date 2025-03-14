<script lang="ts" setup>
import { computed, onMounted, ref, type Ref } from 'vue'
import LogoImage from '@/components/Image/LogoImage.vue'
import { type IBoard } from '@/interfaces/IBoard'
import DarkImage from '@/components/Image/DarkImage.vue'
import LightImage from '@/components/Image/LightImage.vue'
import ToggleCompnent from '@/components/ToggleComponent.vue'
import HideSidebarImage from '@/components/Image/HideSidebarImage.vue'
import {
  getBoardAsync,
  getBoardByIdAsync,
  createTaskAsync,
  updateBoardAsync,
  createBoardAsync,
  deleteBoardAsync,
  updateBoardColumsAsync,
  updateColumnTaskPriorityAsync,
} from '@/apis/kanbanapi.ts'
import { debounce } from 'lodash-es'
import PrimaryLButton from '@/components/Button/PrimaryLButton.vue'
import CardComponent from '@/components/CardComponent.vue'
import ViewComponent from '@/components/Task/ViewComponent.vue'
import type { IColumn } from '@/interfaces/IColumn'
import type { ITask } from '@/interfaces/ITask'
import FormComponent from '@/components/Task/FormComponent.vue'
import EllipsisComponent from '@/components/EllipsisComponent.vue'
import type { ISubTask } from '@/interfaces/ISubTask'
import OperationBoard from '@/components/Board/OperationBoard.vue'
import type { IUpdateBoard } from '@/interfaces/board/IUpdateBoard'
import AlertComponent from '@/components/AlertComponent.vue'
import type { ICreateBoard } from '@/interfaces/board/ICreateBoard'
import ShowSidebarImage from '@/components/Image/ShowSidebarImage.vue'
import type { ICreateColumn } from '@/interfaces/column/ICreateColumn'
import CreateColumn from '@/components/CreateColumn.vue'

const boards: Ref<Array<IBoard>> = ref([])

const board: Ref<IBoard | undefined> = ref(undefined)

const taskCreation: Ref<ITask> = ref({
  id: '',
  boardId: '',
  columnId: '',
  title: '',
  description: '',
  priority: 0,
  subTasks: [],
})

const boardCreation: Ref<ICreateBoard> = ref({
  name: '',
  memberId: 'e198e0d3-2dd5-431c-ac74-3f3d2f4db4cb',
  columns: [],
})

const columnCreations: Ref<ICreateColumn[]> = ref([])

const isShowCreateTaks: Ref<boolean> = ref(false)

const isShowTask: Ref<boolean> = ref(false)

const isShowTooltip: Ref<boolean> = ref(false)

const isShowCreateBoard: Ref<boolean> = ref(false)

const isShowEditBoard: Ref<boolean> = ref(false)

const isShowAlert: Ref<boolean> = ref(false)

const isShowSidebar: Ref<boolean> = ref(true)

const isShowCreateColumn: Ref<boolean> = ref(false)

const selectedTaskId: Ref<string> = ref('')

const selectedColumn: Ref<IColumn | null> = ref(null)

const hasColumns = computed(
  () => board.value && board.value.columns && board.value.columns.length > 0,
)

const boardUpdate: Ref<IUpdateBoard | undefined> = ref(undefined)

const buttons = [
  {
    text: 'Edit Board',
    function: () => {
      isShowTooltip.value = false
      boardUpdate.value = board.value
      isShowEditBoard.value = true
    },
  },
  {
    text: 'Delete Board',
    function: () => {
      isShowTooltip.value = false
      isShowAlert.value = true
    },
  },
]

const modifyBoardButtons = [
  {
    text: 'Delete',
    function: debounce(async () => {
      try {
        if (board.value) await deleteBoardAsync(board.value.id)
        await init()
        isShowAlert.value = false
      } catch (e) {
        console.error(e)
      }
    }),
  },
  {
    text: 'Cancel',
    function: () => {
      isShowAlert.value = false
    },
  },
]

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
      click(board.value)
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

const createBoard = debounce(async () => {
  try {
    await createBoardAsync(boardCreation.value)
    await refreshAside()
  } catch (e) {
    console.error(e)
  }
}, 500)

const updateBoard = debounce(async () => {
  try {
    if (boardUpdate.value) {
      await updateBoardAsync(boardUpdate.value)
      await refreshBoardById()
      isShowEditBoard.value = false
    }
  } catch (e) {
    console.error(e)
  }
}, 500)

const createColumn = debounce(async () => {
  try {
    if (board.value) await updateBoardColumsAsync(board.value?.id, columnCreations.value)
  } catch (e) {
    console.log(e)
  }
}, 500)

const cancelDefaul = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
}

const dragOver = (event: DragEvent) => cancelDefaul(event)

const drag = (event: DragEvent, taskId: string, columnId: string) =>
  event.dataTransfer!.setData('application/json', JSON.stringify({ taskId, columnId }))

const drop = (event: DragEvent) => {
  console.log('drop ', event)
  cancelDefaul(event)
}

const dropTask = async (event: DragEvent, taskId: string, columnId: string): Promise<boolean> => {
  const source = JSON.parse(event.dataTransfer!.getData('application/json'))

  if (board.value) {
    const sourceColumn = board.value.columns.filter((item) => item.id === source.columnId)[0]
    const sourceTask = sourceColumn.tasks.filter((item) => item.id === source.taskId)[0]
    const sourceIndex = sourceColumn.tasks.findIndex((item) => item.id === source.taskId)

    const column = board.value.columns.filter((item) => item.id === columnId)[0]
    const index = column.tasks.findIndex((item) => item.id === taskId)

    if (sourceColumn.id === column.id && index === sourceIndex) {
      return true
    }

    if (sourceColumn.id === column.id && index !== sourceIndex) {
      column.tasks.splice(index > sourceIndex ? index + 1 : index, 0, sourceTask)
      sourceColumn.tasks.splice(index > sourceIndex ? sourceIndex : sourceIndex + 1, 1)
    }

    if (sourceColumn.id !== column.id) {
      column.tasks.splice(index, 0, sourceTask)
      sourceColumn.tasks.splice(sourceIndex, 1)
    }

    column.tasks.forEach((task, index) => (task.priority = index))

    await updateColumnTaskPriorityAsync(columnId, column.tasks)
  }

  cancelDefaul(event)

  return true
}

const dragOverTask = (event: DragEvent) => {
  cancelDefaul(event)
}

onMounted(async () => await init())
</script>

<template>
  <header>
    <div class="logo">
      <LogoImage />
    </div>
    <div class="header-container">
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
          :disabled="board === null || board === undefined"
        ></EllipsisComponent>
      </div>
    </div>
  </header>
  <aside :class="{ hide: isShowSidebar === false }">
    <div class="show-sidebar" v-if="!isShowSidebar" @click="isShowSidebar = true">
      <ShowSidebarImage />
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
      <div class="hide-sidebar" @click="isShowSidebar = false">
        <HideSidebarImage />
        <span>Hide Sidebar</span>
      </div>
    </div>
  </aside>
  <main>
    <template v-if="!hasColumns">
      <div class="empty-container">
        <span class="heading-l">This board is empty. Create a new column to get started.</span>
        <PrimaryLButton @click="isShowCreateColumn = true">
          <span>+ Add New Column</span>
        </PrimaryLButton>
      </div>
    </template>

    <template v-if="hasColumns">
      <div
        class="column"
        v-for="column in board?.columns"
        :key="column.id"
        @drop="drop"
        @dragover="dragOver"
      >
        <span class="heading-s">{{ column.name }} ({{ column.tasks.length }})</span>
        <CardComponent
          v-for="task in column.tasks"
          :key="task.id"
          @click="openTask(task)"
          draggable="true"
          @dragstart="drag($event, task.id, column.id)"
          @dragover="dragOverTask"
          @drop="dropTask($event, task.id, column.id)"
        >
          <template v-slot:title>{{ task.title }}</template>
          <template v-slot:completed-substasks>{{
            task.subTasks.filter((item) => (item as ISubTask).isCompleted).length
          }}</template>
          <template v-slot:totle-substasks>{{ task.subTasks.length }}</template>
        </CardComponent>
      </div>
      <div class="add-new-column" @click="isShowCreateColumn = true">
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
  <!-- 新增 Board -->
  <OperationBoard
    v-model:is-show="isShowCreateBoard"
    v-model:board="boardCreation"
    :function="createBoard"
  ></OperationBoard>

  <!-- 更新 Board -->
  <OperationBoard
    v-model:is-show="isShowEditBoard"
    v-model:board="boardUpdate"
    :function="updateBoard"
  ></OperationBoard>

  <AlertComponent
    v-model:is-show="isShowAlert"
    :button1="modifyBoardButtons[0]"
    :button2="modifyBoardButtons[1]"
  >
    <template v-slot:title>Delete this board?</template>
    <template v-slot:content
      >Are you sure you want to delete the ‘{{ board?.name }}’ board? This action will remove all
      columns and tasks and cannot be reversed.</template
    >
  </AlertComponent>

  <CreateColumn
    v-if="board"
    v-model:is-show="isShowCreateColumn"
    v-model:columns="columnCreations"
    :function="createColumn"
    :board-id="board!.id"
  ></CreateColumn>
</template>

<style lang="scss" scoped>
header {
  grid-area: header;
  display: flex;

  .logo {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 300px;
    border-right: 1px $light-lines solid;
    padding-left: 32px;
  }

  .header-container {
    flex-grow: 1;
    border: 1px $light-lines solid;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 24px;
    padding-right: 32px;

    & > div {
      display: flex;
      gap: 24px;

      & > img {
        object-fit: contain;
      }
    }
  }

  & > span {
    cursor: default;
  }
}

aside {
  border-right: 1px $light-lines solid;
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

  &.hide {
    display: block;
    position: fixed;
    padding: 0;
    bottom: 32px;
    left: 0;

    nav,
    .aside-footer {
      display: none;
    }

    .show-sidebar {
      cursor: pointer;
      position: fixed;
      bottom: 32px;
      background-color: $main-purple;
      border-top-right-radius: 100%;
      border-bottom-right-radius: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 56px;
      height: 48px;
    }
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
  cursor: pointer;
  display: flex;
  gap: 8px;

  span {
    @extend %heading-m;
    color: $medium-grey;
  }
}

.dark {
  header {
    background-color: $dark-grey;

    .logo {
      border-right: 1px $dark-lines solid;
    }

    .header-container {
      border: 1px $dark-lines solid;

      & > span {
        color: white;
      }
    }
  }

  aside {
    border-right: 1px $dark-lines solid;
    background-color: $dark-grey;
  }

  main {
    background-color: $very-dark-grey;
    border: 1px $dark-lines solid;

    .add-new-column {
      background: linear-gradient(
        to bottom,
        rgba($color: #2b2c37, $alpha: 1),
        rgba($color: #2b2c37, $alpha: 0.5)
      );
    }
  }

  nav {
    li {
      &.item:last-child {
        .item-title {
          color: $main-purple;
        }
      }
    }
  }

  .mode-toggle {
    background-color: $very-dark-grey;
  }
}
</style>
