import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm'
import { AssetMeta } from './AssetMeta'
import { AssetType } from './AssetType'

@Entity({
  name: 'asset',
})
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 10,
  })
  ticker: string;

  @Column({ length: 128 })
  name: string;

  @Column({
    type: 'varchar',
    length: 2048,
  })
  description: string;

  @Column({ nullable: true})
  sector: string;

  @Column({
    type: 'timestamp',
  })
  ipo_date: Date;

  @Column({
    nullable: true,
  })
  image: string; //

  @Column({
    nullable: true,
  })
  is_etf: boolean;

  @OneToOne((type) => AssetMeta, (AssetMeta) => AssetMeta.asset)
  asset_meta!: AssetMeta;

  @ManyToOne((type) => AssetType, { cascade: true })
  @JoinColumn({
    name: 'asset_type_id',
  })
  assetype!: AssetType;
  
}
