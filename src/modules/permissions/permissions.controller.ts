import { Controller } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { PermissionsService } from "./permissions.service";

@Controller('perms')
export class PermissionsController{

    constructor(private permsService:PermissionsService){}

    @MessagePattern('get-roles-and-permissions')
    async getRolesAndPermissions(@Payload() payload){
        return this.permsService.getUserPermissoes(payload);
    }

    // @EventPattern('load_Policy_To_User')
    // async load_Policy_To_User(@Payload() payload){
    //     return this.permsService.load_Policy_To_User(payload);
    // }
}