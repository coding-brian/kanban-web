import type { IUpdateSubTask } from '../subtask/IUpdateSubTask'

export interface ICreateTask {
  boardId: string
  columnId: string
  title: string
  description: string
  subTasks: IUpdateSubTask[]
}
