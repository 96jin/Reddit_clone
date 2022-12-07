import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Entity1 from "./Entity1";
import User from "./User";
import Post from './Post';
import Comment from './Comment';

@Entity('votes')
export default class Vote extends Entity1{
  
  @Column()
  value: number;

  @Column()
  username: string;

  @Column({nullable:true})
  postId: number;

  @Column({nullable:true})
  commentId: number;

  @ManyToOne(()=>User)
  @JoinColumn({name: 'username', referencedColumnName: 'username'})
  user: User;
  
  @ManyToOne(()=>Post)
  post: Post;

  @ManyToOne(()=>Comment)
  comment: Comment;
}