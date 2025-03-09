import type { ICreateColumn } from '@/interfaces/ICreateColumn'

export interface ICreateBoard {
  name: string
  memberId: string
  columns: ICreateColumn[]
}
