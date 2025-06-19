import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { CasBinService } from "./casbin.service";
import { JwtAuthGuard } from "./guards/jwtAuthGuard.guard";
import { CasBinGuard } from "./guards/casbin.guard";

@Controller('casbin')
export class CasbinController{

    constructor(private casbinService:CasBinService){}

    @UseGuards(JwtAuthGuard,CasBinGuard)
    @Get('list')
    async getList(){
        return this.casbinService.getListCasbin();
    }

    @Get('group/:id')
    async getOneToGroup(@Param('id') id:string){
        return this.casbinService.getOneToGroup(id);
    }
}