import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { Symbol } from './Symbol'

@Entity({
  name: 'symbol_meta',
})
export class SymbolMeta {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'double',
  })
  price: number

  @Column({ type: 'double' })
  market_cap: number

  @Column()
  is_tracking: boolean

  @OneToOne((type) => Symbol, (Symbol) => Symbol.symbol_meta, { cascade: true })
  @JoinColumn({ name: 'stock_id' })
  symbol: Symbol
}
