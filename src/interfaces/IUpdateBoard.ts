import type { IColumn } from './IColumn'

export interface IUpdateBoard {
  id: string
  name: string
  columns: IColumn[]
}
