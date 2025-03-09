import type { ICreateTask } from '@/interfaces/task/ICreateTask.ts'
import { createAxiosInstance } from './request.ts'
import { type IBoard } from '@/interfaces/IBoard'
import type { ITask } from '@/interfaces/ITask.ts'
import type { IUpdateBoard } from '@/interfaces/IUpdateBoard.ts'

const request = createAxiosInstance({ baseURL: import.meta.env.VITE_APP_API_URL })

/** Board */

export const getBoardAsync = async (): Promise<Array<IBoard>> => await request.get('/board')

export const getBoardByIdAsync = async (id: string): Promise<IBoard> =>
  await request.get(`/board/${id}`)

export const updateBoardAsync = async (param: IUpdateBoard) => await request.put('/board', param)

/** Task */

export const createTaskAsync = async (param: ICreateTask): Promise<ITask> =>
  await request.post(`/task`, param)

export const getTaskAsync = async (id: string): Promise<ITask> => await request.get(`/task/${id}`)

export const deleteTaskAsync = async (id: string): Promise<void> =>
  await request.delete(`/task/${id}`)

export const updateTaskAsync = async (param: ITask): Promise<ITask> =>
  await request.put(`/task`, param)
