import type { ISubTask } from './ISubTask'
import type { IUpdateSubTask } from './subtask/IUpdateSubTask'

export interface ITask {
  id: string
  columnId: string
  boardId: string
  title: string
  description: string
  priority: number
  subTasks: ISubTask[] | IUpdateSubTask[]
}
