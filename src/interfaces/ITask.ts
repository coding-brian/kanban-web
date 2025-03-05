import type { ISubTask } from './ISubTask'

export interface ITask {
  id: string
  columnId: string
  boardId: string
  title: string
  description: string
  subTasks: ISubTask[]
}
