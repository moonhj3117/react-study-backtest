import {Entity, PrimaryGeneratedColumn, Column, Index} from 'typeorm'

@Entity({
    name: 'asset_type',
})

export class Asset_Type{
    @PrimaryGeneratedColumn()
    id: number;
    @Index()
    @Column({ length:32 })
    type: string
}