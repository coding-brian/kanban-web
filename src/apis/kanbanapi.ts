import { createAxiosInstance } from './request.ts'
import { type IBoard } from '@/interfaces/IBoard'

const request = createAxiosInstance({ baseURL: import.meta.env.VITE_APP_API_URL })

export const getBoardAsync = async (): Promise<Array<IBoard>> => await request.get('/board')

export const getBoardByIdAsync = async (id: string): Promise<IBoard> =>
  await request.get(`/board/${id}`)
