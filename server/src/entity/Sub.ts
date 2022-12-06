import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import {Expose} from 'class-transformer'
import Post from "./Post";
import User from "./User";
import Entity1 from "./Entity1";

@Entity('subs')
export default class Sub extends Entity1{
  @Index()
  @Column({unique:true})
  name: string;

  @Column()
  title: string;

  @Column({type: 'text', nullable:true})
  description: string;

  @Column({nullable:true})
  imageUrn: string;

  @Column({nullable:true})
  bannerUrn: string;

  @Column()
  username: string;

  @ManyToOne(()=>User)  // 연관관계 JoinColumn등을 쓸 때 다중성을 나타내는 데코레이터 @ManyToMany , @ManyToOne, @OneToOne.. 등을 필수로 사용해야한다
  @JoinColumn({name: 'username', referencedColumnName: 'username'}) // referencedColumnName 를 명시하지않으면 해당 테이블의 Pk를 참조함
  user: User;

  @OneToMany(()=>Post, (post)=>post.subName)
  posts: Post[];

  @Expose() // class로 front에 보낸다. ( sub.imageUrl() getter형식 )
  get imageUrl(): string {
    return this.imageUrn ?
    `${process.env.APP_URL}/images/${this.imageUrn}` :
    "https://www.gravatar.com/avatar?d=mp&f=y"
  }

  @Expose()
  get bannerUrl(): string | undefined {
    return this.bannerUrn ?
    `${process.env.APP_URL}/images/${this.bannerUrn}` :
    undefined
  }
}