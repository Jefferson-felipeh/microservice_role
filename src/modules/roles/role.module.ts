import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./entities/Role.entity";
import { UserRole } from "../user_roles/entities/UserRole.entity";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import { RoleRepository } from "./repository/role.repository";
import { CasBinGuard } from "../casbin/guards/casbin.guard";
import { CasBinService } from "../casbin/casbin.service";
import { CasbinRuleEntity } from "../casbin/entities/casbin.entity";
import { CasbinModule } from "../casbin/casbin.module";
import { ValidateRoleMiddleware } from "src/common/middlewares/validateRole.middleware";
import { ValidateGroupRoleMiddleware } from "src/common/middlewares/validateGroupRole.middleware";

@Module({
    imports: [
        TypeOrmModule.forFeature([Role,UserRole,CasbinRuleEntity]),
        CasbinModule
    ],
    controllers: [RoleController],
    providers: [
        RoleService,
        RoleRepository,
        CasBinGuard,
        CasBinService
    ]
})
export class RoleModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(
            ValidateRoleMiddleware,
            ValidateGroupRoleMiddleware
        )
        .forRoutes('role/assign-role')
    }
}