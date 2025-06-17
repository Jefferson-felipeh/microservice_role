import { CommonEntityRole } from "src/common/common.entity";
import { UserRole } from "src/modules/user_roles/entities/UserRole.entity";
import { Column, Entity, JoinColumn, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('role')
export class Role extends CommonEntityRole{
    @Column({name: 'ROLE',unique: true, nullable: false})
    role:string

    //Relacionamento com a entidade UserRole_
    //Um Role pode ser associado a muitos usuários_
    @OneToMany(() => UserRole, (userRole) => userRole.role,{eager: true})//Observa que estou ligando o campo userRole com o role de UserRole, e vice-versa;

    //observa que o decorator @oneToMany() de relacionamente requer dois argumentos:
    //1- O primeiro é indicando de qual tabela ele vai buscar ou pegar os dados: () => UserRole;
    //2- O segundo indica como esse campo ou ate mesmo essa entidade vai conseguir se relacionar com a entdade UserRole e preencher o campo role;

    userRole:UserRole[]//Aqui ire agrupar todos os usuários que estão associado a essa Role atravez da entidade UserRole;

    /*
        Um registro de UserRole poderá estar associado muitos dados ou registros da entidade UserRole, pois um usuário
        poderá esta associado a um registro específico da entidade Role, e um registro da entidade Role poderá estar
        associado a muitos usuários;
    */
}