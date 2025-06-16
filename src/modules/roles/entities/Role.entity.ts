import { CommonEntityRole } from "src/common/common.entity";
import { UserRole } from "src/modules/user_roles/entities/UserRole.entity";
import { Column, Entity, JoinColumn, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('role')
export class Role extends CommonEntityRole{
    @Column({name: 'ROLE',unique: true, nullable: false})
    role:string

    //Relacionamento com a entidade UserRole_
    //Um Role pode ser associado a muitos usuários_
    @OneToMany(() => UserRole, (userRole) => userRole.role,{eager: true, cascade: true})//Observa que estou ligando o campo userRole com o role de UserRole, e vice-versa;
    userRole:UserRole[]//Aqui ire agrupar todos os usuáirios que estão associado a essa Role atravez da entidade UserRole;
}