import { HttpException, Injectable } from "@nestjs/common";
import { UserRoleDto } from "./dtos/createUserRole.dto";
import { UserRoleRepository } from "./repository/userRole.repository";

@Injectable()
export class UserRolesService{

    constructor(private userRoleRepository:UserRoleRepository){}

    async create(dataCreatedUser:{id:string,firstname:string}):Promise<UserRoleDto>{
        //Validando o id obtido_
        if(!dataCreatedUser) throw new HttpException('Erro ao criar UserRole!',400);

        return await this.userRoleRepository.create(dataCreatedUser);
    }

    async deleteRole(id:string):Promise<object>{
        if(!id) throw new HttpException('Identificador Inválido!',400);

        return this.userRoleRepository.deleteRole(id);
    }
}