import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { CasBinService } from "./casbin.service";
import { JwtAuthGuard } from "./guards/jwtAuthGuard.guard";
import { CasBinGuard } from "./guards/casbin.guard";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller('casbin')
export class CasbinController {

    constructor(private casbinService: CasBinService) { }

    @UseGuards(JwtAuthGuard, CasBinGuard)
    @Get('list')
    async getList() {
        return this.casbinService.getListCasbin();
    }

    @Get('group/:id')
    async getOneToGroup(@Param('id') id: string) {
        return this.casbinService.getOneToGroup(id);
    }

    @MessagePattern('casbinGuard-require')
    async casbinnGuardUser(@Payload() data) {
        const enforcer = await this.casbinService.getEnforce(data.user);
        return enforcer.enforce(data.user?.sub,data.path,data.method);
    }

    // @MessagePattern('get-roles-and-permissions')
    // async getRolesAndPermissions(@Payload() payload){
    //     return this.casbinService.getUserPermissoes(payload);
    // }
}