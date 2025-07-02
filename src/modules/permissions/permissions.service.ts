import { HttpException, Injectable } from "@nestjs/common";
import { MenuRepository } from "../menus/repository/MenuRepository.repository";
import { CasBinService } from "../casbin/casbin.service";
import { PersonalProfileRepository } from "../personal_profile/repository/personal-profile.repository";

@Injectable()
export class PermissionsService{
    constructor(
        private menuRepository:MenuRepository,
        private casbinService:CasBinService,
        private personalProfileRepository:PersonalProfileRepository
    ){}

    async load_Policy_To_User(){
        await this.casbinService.loadPolicy();
    }

    //Método executado quando o usuário faz login_
    async getUserPermissoes(payload){
        try{
            if(!payload) throw new HttpException('Dados do payload Inválidos!',403);

            //Buscando as permissões que o usuário possue na entidade casbin_
            const casbin_data = await this.casbinService.getUserPermissions(payload);

            if(!casbin_data) throw new HttpException('Dados não obtidos!',403);
            
            //Buscando os menus com base no campo permission em ambas as entidades com base nas permissoes do casbin_
            const menus = await this.menuRepository.findMenus(casbin_data.perms);

            if(!menus) throw new HttpException('Menus não obtidos!',403);
            
            const profiles = await this.personalProfileRepository.getAllProfiles(casbin_data.perms);
            
            if(!profiles) throw new HttpException('Profiles não obtidos!',403);
            
            //Retornando as permissoes e os menus que o usuário tem permissão_
            const obj_structured = {
                casbin_data,
                menus,
                profiles
            };
            
            return obj_structured;
        }catch(error){
            console.log(error.message || error)
        }
    }

    //OBS:
    //Verificar o porque que um usuário recem criado, ao fazer login, nao é listada nem retornada as suas permissões,
    //somente depois que esse microservice é recarregado.
}