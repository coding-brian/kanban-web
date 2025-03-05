import type { ITask } from './ITask'

export interface IColumn {
  id: string
  boardId: string
  name: string
  isActive: boolean
  tasks: ITask[]
}
