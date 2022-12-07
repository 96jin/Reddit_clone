import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Exclude, Expose } from 'class-transformer'
import Entity1 from "./Entity1";
import User from './User';
import Sub from './Sub';
import Vote from './Vote';
import Comment from "./Comment";
import { makeId , slugfy } from "../utils/helper";

@Entity('posts')
export default class Post extends Entity1{

  @Index()
  @Column()
  identifier: string;

  @Column()
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({nullable: true, type: "text"})
  body: string;

  @Column() 
  subName: string; 

  @Column()
  username: string;

  @ManyToOne(()=>User, (user)=>user.posts)
  @JoinColumn({name: "username", referencedColumnName: "username"})
  user: User;

  @ManyToOne(()=>Sub, (sub)=>sub.posts)
  @JoinColumn({name: "subName", referencedColumnName: "name"})
  sub: Sub;

  @Exclude()  // 변환을 하는 도중에 properties 를 skip 해주는것. plainToInstance, instanceToPlain 으로 변환할때 그냥 넘어감
  @OneToMany(()=>Comment , (comment)=>comment.post)
  comments: Comment[];

  @Exclude()
  @OneToMany(()=>Vote, (vote)=>vote.post)
  votes: Vote[];

  @Expose()   // 변환할때 return 값을 프론트단으로 전송해준다.
  get url(): string {
    return `/r/${this.subName}/${this.identifier}/${this.slug}`
    // 레딧에서 경로가 r 로 시작하기 때문에 따라하는것이다.
  }

  @Expose()
  get comentCount(): number {
    return this.comments?.length  // comments가 있을때만 실행
  }

  @Expose()
  get voteScore(): number {
    return this.votes?.reduce((memo, curt)=> memo + (curt.value || 0),0)
  }

  protected userVote: number;

  setUserVote(user: User){
    const index = this.votes?.findIndex((v)=> v.username === user.username)
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert() // 값을 DB에 저장하기전에 아래 함수를 실행해서 값을 변환
  makeIdAndSlug(){
    this.identifier = makeId(7);
    this.slug = slugfy(this.title)
  }
}