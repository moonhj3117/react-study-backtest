import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm'
import { AssetMeta } from './AssetMeta'
import { Asset_Type } from './AssetType'

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

  @Column()
  sector: string;

  @Column({
    type: 'timestamp',
  })
  ipo_date: Date;

  @Column({
    nullable: true,
  })
  image: string;

  @Column()
  is_etf: boolean;

  @OneToOne((type) => AssetMeta, (AssetMeta) => AssetMeta.asset)
  asset_meta: AssetMeta;

  @ManyToOne((type) => Asset_Type, { cascade: true })
  @JoinColumn({
    name: 'asset_type_id',
  })
  asset_type: Asset_Type;
}
