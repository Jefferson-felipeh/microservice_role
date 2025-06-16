import { HttpException, Injectable } from "@nestjs/common";
import { RoleDto } from "./dtos/role.dto";
import { RoleRepository } from "./repository/role.repository";

@Injectable()
export class RoleService{

    constructor(private roleRepository:RoleRepository){}

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

    async delete(id:string):Promise<object>{
        if(!id) throw new HttpException('Identificador Inválido!',400);
        return this.roleRepository.delete(id);
    }
}