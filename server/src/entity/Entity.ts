import {BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm'

export default abstract class Entity extends BaseEntity{
  @PrimaryGeneratedColumn()   // PK 를 나타냄
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}