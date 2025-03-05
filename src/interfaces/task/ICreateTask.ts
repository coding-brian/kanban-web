import type { ICreateSubTask } from '../subtask/ICreateSubTask'

export interface ICreateTask {
  boardId: string
  columnId: string
  title: string
  description: string
  subTasks: ICreateSubTask[]
}
