import { CommonEntityRole } from "src/common/common.entity";
import { Role } from "src/modules/roles/entities/Role.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";

@Entity('user_role')
export class UserRole extends CommonEntityRole{
    @Column({name: 'USER_ID', type:'varchar',nullable:false})
    userid: string

    //Cada vez que um usuário for cadastrado no banco, ele vai criar um novo registro na entidade UserRole_

    //A entidade UserRole faz relacionamento com a entidade Role atravez desse campo role_
    @ManyToOne(() => Role, (role) => role.userRole)//Muitos usuários/registro podem estar associados a apenas um Role;
    @JoinColumn({name: 'ROLEID'})//Será criado essa coluna RoleId automaticamente pelo typeorm como chave estrangeira apontando para o id da entidade Role;
    //Esse campo vai receber os dados da role padrão já cadastrada no banco, isso porque estou buscando a role 
    // manualmente no repositório e atribuindo a esse campo role quando estou salvando os dados_
    role:Role//Cada registro em UserRole estará associado a uma Role da entidade Role;

    /*
        Ao usar o @JoinColumn, irei criar a coluna ROLEID automaticamente que vai ser a chave estrangeira dessa entidade
        que vai estar associada com a chave primaria(coluna id) da entidade Role;
    */
}