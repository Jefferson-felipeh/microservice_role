import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Menu } from "./entities/Menu.entity";
import { MenuController } from "./menus.controller";
import { MenuService } from "./menus.service";
import { MenuRepository } from "./repository/MenuRepository.repository";
import { CasBinService } from "../casbin/casbin.service";
import { CasbinRuleEntity } from "../casbin/entities/casbin.entity";
import { CasbinModule } from "../casbin/casbin.module";
import { PolicyService } from "../casbin/helpers/policy.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Menu,CasbinRuleEntity]),
        CasbinModule
    ],    
    controllers: [MenuController],
    providers: [
        MenuService,
        MenuRepository,
        CasBinService,
        PolicyService
    ],
    exports: [
        MenuRepository
    ]
})
export class MenuModule{}