import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm'
import { SymbolMeta } from './SymbolMeta'
import { SymbolType } from './SymbolType'

@Entity({
  name: 'symbols',
})
export class Symbol {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 10,
  })
  ticker: string

  @Column({
    type: 'varchar',
    length: 4096,
  })
  description: string

  @Column()
  sector: string

  @Column({
    type: 'timestamp',
  })
  ipo_date: Date

  @Column({
    nullable: true,
  })
  image: string

  @Column()
  is_etf: boolean

  @OneToOne((type) => SymbolMeta, (SymbolMeta) => SymbolMeta.symbol)
  symbol_meta: SymbolMeta

  @ManyToOne((type) => SymbolType, { cascade: true})
  @JoinColumn({ 
    name: 'symbol_type_id'
  })
  symbol_type: SymbolType
}
