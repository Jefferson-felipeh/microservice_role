import { HttpException, Injectable } from "@nestjs/common";
import { MenuRepository } from "../menus/repository/MenuRepository.repository";
import { CasBinService } from "../casbin/casbin.service";
import { Payload } from "@nestjs/microservices";

@Injectable()
export class PermissionsService{
    constructor(
        private menuRepository:MenuRepository,
        private casbinService:CasBinService
    ){}

    async load_Policy_To_User(){
        await this.casbinService.loadPolicy();
    }

    async getUserPermissoes(payload){
        try{
            if(!payload) throw new HttpException('Dados do payload Inválidos!',403);
    
            const casbin_data = await this.casbinService.getUserPermissoes(payload);

            if(!casbin_data) throw new HttpException('Dados não obtidos!',403);
            
            const menus = await this.menuRepository.findMenus(casbin_data.perms);

            if(!casbin_data) throw new HttpException('Menus não obtidos!',403);
            
            const obj_structured = {
                casbin_data,
                menus
            };
            console.log(menus);
            return obj_structured;
        }catch(error){
            console.log(error.message || error)
        }
    }

    //OBS:
    //Verificar o porque que um usuário recem criado, ao fazer login, nao é listada nem retornada as suas permissões,
    //somente depois que esse microservice é recarregado.
}