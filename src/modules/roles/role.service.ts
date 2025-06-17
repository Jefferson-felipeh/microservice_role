import { HttpException, Injectable } from "@nestjs/common";
import { RoleDto } from "./dtos/role.dto";
import { RoleRepository } from "./repository/role.repository";
import { CasBinService } from "../casbin/casbin.service";
import { Assign_roleDto } from "./dtos/assing_role.dto";

@Injectable()
export class RoleService{

    constructor(
        private roleRepository:RoleRepository,
        private casbinService: CasBinService
    ){}

    async create(dataBody:RoleDto):Promise<RoleDto>{
        try{
            if(!dataBody) throw new HttpException('erro na estrutura dos dados!',400);

            return this.roleRepository.create(dataBody);
        }
        catch(error){
            throw new HttpException(error.message || error,400);
        }
    }

    getMany(){
        return this.roleRepository.getMany();
    }

    async getOne(id:string):Promise<RoleDto>{
        if(!id) throw new HttpException('Identificador não atribuido!',400);
        return this.roleRepository.getOne(id);
    }

    async delete(id:string):Promise<object>{
        if(!id) throw new HttpException('Identificador Inválido!',400);
        return this.roleRepository.delete(id);
    }

    async updateRole(id:string,dataRole:RoleDto):Promise<object>{
        if(!id) throw new HttpException('Identificador não atribuido!',400);
        const update = await this.roleRepository.updateRole(id,dataRole);
        return update;
    }

    async assign_role(role:Assign_roleDto):Promise<object>{
        if(!role.id || !role.role) throw new HttpException('Dados não fornecidos!',400);
        const assign_role_attribuited = await this.casbinService.assign_role(role.id,role.role);
        if(!assign_role_attribuited) throw new HttpException('Erro ao atribuir role!',400);
        return assign_role_attribuited;
    }
}