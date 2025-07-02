import { HttpException, Inject, Injectable, forwardRef } from "@nestjs/common";
import { CreateMenuDto } from "../dtos/createMenu.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Menu } from "../entities/Menu.entity";
import { In, Repository } from "typeorm";
import { CasBinService } from "src/modules/casbin/casbin.service";

@Injectable()
export class MenuRepository{

    constructor(
        @InjectRepository(Menu) private repository:Repository<Menu>,
        private casbinService: CasBinService
    ){}

    async create(dataMenu:CreateMenuDto):Promise<object>{
        try{
            const savePolicie = await this.casbinService.getPolicieToMenus(dataMenu);
            
            const exists = await this.repository.findOne({
                where: {
                    label: dataMenu.label,
                    path: dataMenu.path,
                    permission: dataMenu.permission
                }
            });

            console.log(exists);
            if(exists) throw new HttpException('Menu já cadastrado na base de dados!',400);

            const createMenu = this.repository.create(dataMenu);
    
            await this.repository.save(createMenu);
    
            return savePolicie;
        }catch(error){
            throw new HttpException(error.message || error,400);
        }
    }

    findAll(){
        return this.repository.find();
    }

    async findMenus(perms){
        try{
            return await this.repository.find({
                where: {
                    active: true,
                    permission: In(perms)
                }
            });
        }catch(error){
            console.log(error.message || error);
        }
    }
}