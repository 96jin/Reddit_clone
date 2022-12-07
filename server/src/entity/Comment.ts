import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import Entity1 from "./Entity1";
import User from './User';
import Post from './Post';
import Vote from "./Vote";
import { Exclude, Expose } from "class-transformer";
import { makeId } from "../utils/helper";

@Entity('comments')
export default class Comment extends Entity1{

  @Index()
  @Column()
  identifier: string;

  @Column()
  body: string;

  @ManyToOne(()=>User)
  @JoinColumn({name: 'username', referencedColumnName: 'username'})
  username: string;

  @Column()
  postid: number;

  @ManyToOne(()=>Post, (post)=>post.comments, {nullable:false})
  post: Post;

  @Exclude()
  @OneToMany(()=>Vote, (vote)=>vote.comment)
  votes: Vote[]

  protected userVote: number;

  setUserVote(user: User){
    const index = this.votes?.findIndex((v)=> v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @Expose()
  get voteScore(): number {
    const initialValue = 0;
    return this.votes?.reduce((preValue, curObj)=> preValue + (curObj.value || 0), initialValue)
  }

  @BeforeInsert()
  makeId(){
    this.identifier = makeId(8)
  }
}