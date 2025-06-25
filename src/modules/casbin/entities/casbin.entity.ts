import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// Entidade do módulo casbin usado para armazenar as regras de permissão_
//Nessa entidade ou banco de dados irei armazenar as políticas, como: p, jefferson, /roles/ get
@Entity('casbin_rule')
export class CasbinRuleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  ptype: string;

  @Column({ nullable: true })
  v0: string;

  @Column({ nullable: true })
  v1: string;

  @Column({ nullable: true })
  v2: string;

  @Column({ nullable: true })
  v3: string;

  @Column({ nullable: true })
  v4: string;

  @Column({ nullable: true })
  v5: string;

  @CreateDateColumn({nullable: true})
  createdOn:Date

  @Column({nullable: true})
  createdBy:string

  @Column({default: ''})
  modifiedOn:string
}
