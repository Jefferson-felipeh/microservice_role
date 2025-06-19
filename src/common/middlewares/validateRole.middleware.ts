import { HttpException, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction } from "express";
import { Role } from "src/modules/roles/entities/Role.entity";
import { RoleRepository } from "src/modules/roles/repository/role.repository";
import { Repository } from "typeorm";

//Criando um middleware para verificar se a função em que etsou associando o usuário já existe_
@Injectable()
export class ValidateRoleMiddleware implements NestMiddleware{
    constructor(private roleRepository:RoleRepository){}

    async use(req: Request, res: Response, next: NextFunction){
        try{
            const roleRequest = req.body as any;
            
            if(!roleRequest?.role || roleRequest?.role.split('') == '') throw new HttpException('Função não atribuida!',400);

            const roleData = await this.roleRepository.roleOneToName(roleRequest?.role);

            if(!roleData) throw new HttpException('Função não encontrada, criar função!',400);

            next();
        }catch(error){
            throw new HttpException(error.message || error,400);
        }
    }
}