import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { IUser } from "../../../app/interfaces/IUser";

@Entity()
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  email!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 100 })
  password!: string;
}
