import { HttpException, Inject, Injectable, forwardRef } from "@nestjs/common";
import { CreateMenuDto } from "../dtos/createMenu.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Menu } from "../entities/Menu.entity";
import { Repository } from "typeorm";
import { CasBinService } from "src/modules/casbin/casbin.service";

@Injectable()
export class MenuRepository{

    constructor(
        @InjectRepository(Menu) private repository:Repository<Menu>,
        private casbinService: CasBinService
    ){}

    async create(dataMenu:CreateMenuDto):Promise<object>{
        try{
            const savePolicie = await this.casbinService.getPolicieToMenu(dataMenu.permission);
    
            const createMenu = this.repository.create(dataMenu);
    
            await this.repository.save(createMenu);
    
            return savePolicie;
        }catch(error){
            throw new HttpException(error.message || error,400);
        }
    }

    findMenus(){
        return this.repository.find({
            where: {
                active: true
            }
        });
    }
}