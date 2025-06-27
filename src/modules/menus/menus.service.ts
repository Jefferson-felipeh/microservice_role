import { HttpException, Injectable } from "@nestjs/common";
import { CreateMenuDto } from "./dtos/createMenu.dto";
import { MenuRepository } from "./repository/MenuRepository.repository";

@Injectable()
export class MenuService{
    constructor(private repository:MenuRepository){}

    async create(dataMenu:CreateMenuDto):Promise<object>{
        if(!dataMenu) throw new HttpException('Dados Inválidos!',400);

        return this.repository.create(dataMenu);
    }
}