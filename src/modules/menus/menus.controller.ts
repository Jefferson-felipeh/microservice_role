import { Body, Controller, Post } from "@nestjs/common";
import { CreateMenuDto } from "./dtos/createMenu.dto";
import { MenuService } from "./menus.service";

@Controller('menu')
export class MenuController{
    constructor(private menuService:MenuService){}

    @Post('create')
    async create(@Body() dataMenu:CreateMenuDto):Promise<object>{
        return this.menuService.create(dataMenu);
    }
}