import type { IUpdateColumn } from '@/interfaces/column/IUpdateColumn'

export interface IUpdateBoard {
  name: string
  memberId: string
  columns: IUpdateColumn[]
}
