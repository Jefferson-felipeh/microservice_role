import { HttpException, Injectable } from "@nestjs/common";
import { Role } from "../entities/Role.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class RoleRepository{

    constructor(@InjectRepository(Role) private repository:Repository<Role>){}

    async create(dataBody:Role):Promise<Role>{
        const createRole = this.repository.create(dataBody);

        if(!createRole) throw new HttpException('Erro ao criar Role!',400);

        const saveRole = await this.repository.save(createRole);

        if(!saveRole) throw new HttpException('Error ao salvar role!',400);

        return saveRole;
        
    }

    getMany(){
        return this.repository.find();
    }

    async delete(id:string):Promise<object>{
        try{

            const user = await this.repository.findOneBy({id});

            if(!user) throw new HttpException('Role não encontrada!',400);

            const delete_user = await this.repository.remove(user);

            if(!delete_user) throw new HttpException('Falha ao deletar Role!',400);

            return {
                status: 'Deleted SuccessFuly!',
                message: `Role ${user.role} deletada!`
            }
        }
        catch(error){
            throw new HttpException(error.message || error,400);
        }
    }
}