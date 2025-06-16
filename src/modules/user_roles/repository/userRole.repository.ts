import { HttpException, Injectable } from "@nestjs/common";
import { UserRole } from "../entities/UserRole.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "src/modules/roles/entities/Role.entity";
import { CasBinService } from "src/modules/casbin/casbin.service";

@Injectable()
export class UserRoleRepository{

    constructor(
        @InjectRepository(Role) private repositoryRole:Repository<Role>,
        @InjectRepository(UserRole) private repository:Repository<UserRole>,
        private casbinService:CasBinService
    ){}

    async create(id:string):Promise<UserRole>{
        //Observe que, todo usuário recem criado receberá um role padrão_

        //Como as Roles já foram cadastradas manualmente na entidade Role,
        //estarei buscando pela Role padrão para atribuir a todos os usuário recem criados_
        //Todos terão essa role como padrão de usuário comun ao se cadastrarem_
        const defaultRole = await this.repositoryRole.findOne({
            where: {role:'user'},
        });

        if(!defaultRole) throw new HttpException('Role não encontrado!',400);

        //A entidade User_Role vai receber dois valores associados ao campo userId, que vem do microservice de usuários ao criar um novo usuário_
        //E o segundo campo é o role, que vai receber
        const createUserRole = this.repository.create({
            userid: id,
            role: defaultRole//Preenchendo o campo role da entidade com o Role obtido da entidade Role;
        });

        if(!createUserRole) throw new HttpException('Erro ao criar estrutura!',400);

        const saveUserRole = await this.repository.save(createUserRole);

        await this.casbinService.getDataUserCasbin(saveUserRole);

        return saveUserRole;
    }

    async deleteRole(id:string):Promise<object>{
        const userId = await this.repository.findOneBy({userid: id});

        if(!userId) throw new HttpException('Usuário não encontrado na entidade UserRoles!',400);

        const deleteUserRole = await this.repository.remove(userId);

        console.log(deleteUserRole);

        return {
            status: 'Deleted Successfuly',
            data: deleteUserRole
        }
    }
}