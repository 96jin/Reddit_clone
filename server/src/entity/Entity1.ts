import { instanceToPlain } from 'class-transformer';
import {BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm'

// 공통적으로 사용되는 열 들을 BaseEntity 에 넣어준다.
// strictPropertyInitialization 를 false로 줘서 오류 제거.
export default abstract class Entity1 extends BaseEntity{
  @PrimaryGeneratedColumn()   // PK 를 나타냄
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toJSON(){
    return instanceToPlain(this)  
    // 이걸 해줘야 expose()에서 return 한걸 프론트로 보낼 수 있다.
  }
}