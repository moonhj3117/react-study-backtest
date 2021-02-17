import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Symbol } from './Symbol'

@Entity({
  name: 'sector_weigthings',
})
export class SectorWeighting {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((type) => Symbol, { cascade: true })
  @JoinColumn({
    name: 'stock_id',
  })
  stock: Symbol

  @Column()
  sector: string

  @Column({ type: 'double' })
  percentage: number
}
