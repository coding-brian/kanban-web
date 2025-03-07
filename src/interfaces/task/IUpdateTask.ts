import type { ITask } from '../ITask'
import type { IUpdateSubTask } from '../subtask/IUpdateSubTask'

export interface IUpdateTask extends Omit<ITask, 'subTasks'> {
  subTasks: IUpdateSubTask[]
}
