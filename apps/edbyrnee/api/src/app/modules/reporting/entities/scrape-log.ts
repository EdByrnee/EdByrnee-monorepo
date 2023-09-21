import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ScrapeLog', timestamps: true })
export class ScrapeLog extends Model<ScrapeLog> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({
    type: DataType.UUID,
    unique: true,
    allowNull: true,
  })
  uuid: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  scrapedAt: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  scrapeName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  scrapeResult: string;

  @Column({
    type: DataType.DOUBLE(15, 2),
    allowNull: true,
  })
  scrapeCount: number;
}
