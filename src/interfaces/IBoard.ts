import type { IColumn } from './IColumn'

export interface IBoard {
  id: string
  name: string
  memberId: string
  isSelected: boolean
  imageSrc: string
  columns: IColumn[]
}
