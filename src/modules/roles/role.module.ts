import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./entities/Role.entity";
import { UserRole } from "../user_roles/entities/UserRole.entity";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import { RoleRepository } from "./repository/role.repository";
import { CasbinRuleEntity } from "../casbin/entities/casbin.entity";
import { CasBinGuard } from "../casbin/guards/casbin.guard";
import { CasbinModule } from "../casbin/casbin.module";
import { CasBinService } from "../casbin/casbin.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Role, UserRole,CasbinRuleEntity]),
    ],
    controllers: [RoleController],
    providers: [
        RoleService,
        RoleRepository,
        CasBinService,
        CasBinGuard
    ]
})
export class RoleModule{}