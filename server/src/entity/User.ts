import { Exclude } from "class-transformer";
import { IsEmail, Length } from "class-validator"
import { Entity, Column, BaseEntity, Index, OneToMany, BeforeInsert } from "typeorm"
import bcrypt from 'bcryptjs'
import Post from "./Post";
import Vote from "./Vote";
import Entity1 from "./Entity1";

@Entity("users")  // users 클래스가 엔터티임을 나타내는 부분이다. CREATE TABLE users 부분
export default class User extends Entity1 {

  // Decorator 첫번째 문자는 대문자로 작성해야한다.
  @Index()  // 데이터베이스 인덱스 생성, 엔터티 속성 또는 엔터티에 사용 가능.
  @IsEmail(undefined , {message: '이메일 주소가 잘못되었습니다.'})  // 유효성 체크 부분이다 (isEmail, Length..)
  @Length(1,255,{message: '이메일 주소는 비워둘 수 없습니다.'})
  @Column({unique:true})   // 열을 나타내는 부분
  email: string;

  @Index()
  @Length(3,32,{message: '사용자 이름은 3자 이상이어야 합니다.'})
  @Column({unique:true})
  username: string;

  @Exclude()
  @Column()
  @Length(6,255,{message: '비밀번호는 6자 이상이어야합니다.'})
  password: string;

  // 관계에 관한 부분
  @OneToMany(()=>Post, (post)=>post.user)
  posts: Post[];

  @OneToMany(()=>Vote, (vote)=> vote.user)
  votes: Vote[];

  @BeforeInsert()
  async hashPassword(){
    this.password = await bcrypt.hash(this.password, 6)
  }
}