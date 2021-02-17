import {Entity, PrimaryGeneratedColumn, Column, Index} from 'typeorm'

@Entity({
    name: 'symbol_type',
})

export class SymbolType{
    @PrimaryGeneratedColumn()
    id: number;
    @Index()
    @Column({ length:32 })
    type: string
}