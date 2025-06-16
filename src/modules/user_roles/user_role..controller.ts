import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { UserRolesService } from "./user_role.service";

@Controller('user-roles')
export class UserRolesController{
    constructor(private userRoleService:UserRolesService){}

    /*
        Quando o usuário se cadastrar no sistema, o microservice de usuários emitirá ou enviará
        o id do usuário recem criado para esse microserviço de gerenciamento de Roles_
    */
    
    //Ao receber o id do producer, ele chama um método que salvar o usuário com um role padrão_
    @EventPattern('ms_roles_pattern')
    getDataUser(@Payload() id:string){
        return this.userRoleService.create(id);
    }

    @EventPattern('role_delete')
    roleDelete(@Payload() id:string){
        return this.userRoleService.deleteRole(id);
    }
}