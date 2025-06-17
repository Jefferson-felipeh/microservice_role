import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { RoleDto } from "./dtos/role.dto";
import { RoleService } from "./role.service";
import { CasBinGuard } from "../casbin/guards/casbin.guard";
import { JwtAuthGuard } from "../casbin/guards/jwtAuthGuard.guard";
import { Assign_roleDto } from "./dtos/assing_role.dto";

@Controller('role')
export class RoleController{

    /*
        Iremos criar Roles manualmente de acordo com a necessidade_
    */

    constructor(private roleService:RoleService){}

    @UseGuards(JwtAuthGuard,CasBinGuard)
    //Criar Role manualmente_
    @Post('create-role')
    async create(@Body() dataBody:RoleDto):Promise<RoleDto>{
        return this.roleService.create(dataBody);
    }

    //Listar todos os Roles do banco de dados_
    //Para que o casbin possa ter acesso aos dados do usuário na requisição, é necessário
    //que configure ante o JWT_
    @UseGuards(JwtAuthGuard,CasBinGuard)
    @Get('list')
    getMany(){
        return this.roleService.getMany();
    }
    
    @UseGuards(JwtAuthGuard,CasBinGuard)
    @Get('getOne/:id')
    async getOne(@Param('id') id:string):Promise<RoleDto>{
        return this.roleService.getOne(id);
    }

    //Deletar Roles específicos_
    @UseGuards(JwtAuthGuard,CasBinGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id:string):Promise<object>{
        return this.roleService.delete(id);
    }

    @UseGuards(JwtAuthGuard,CasBinGuard)
    @Patch('update/:id')
    async updateRole(@Param('id') id:string,dataRole:RoleDto):Promise<object>{
        return this.roleService.updateRole(id,dataRole);
    }
    
    @UseGuards(JwtAuthGuard,CasBinGuard)
    @Post('assign-role')
    async assign_role(@Body() role:Assign_roleDto):Promise<object>{
        return this.roleService.assign_role(role);
    }
}