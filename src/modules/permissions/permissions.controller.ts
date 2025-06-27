import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PermissionsService } from "./permissions.service";

@Controller('perms')
export class PermissionsController{

    constructor(private permsService:PermissionsService){}

    @MessagePattern('get-roles-and-permissions')
    async getRolesAndPermissions(@Payload() payload){
        return this.permsService.getUserPermissoes(payload);
    }
}