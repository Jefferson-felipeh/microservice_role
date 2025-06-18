import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "../roles/entities/Role.entity";
import { UserRole } from "./entities/UserRole.entity";
import { UserRolesController } from "./user_role..controller";
import { UserRolesService } from "./user_role.service";
import { UserRoleRepository } from "./repository/userRole.repository";
import { CasBinService } from "../casbin/casbin.service";
import { CasbinRuleEntity } from "../casbin/entities/casbin.entity";
import { CasbinModule } from "../casbin/casbin.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRole,Role,CasbinRuleEntity]),
    CasbinModule
  ],
  controllers: [
    UserRolesController
  ],
  providers: [
    UserRolesService,
    UserRoleRepository,
    CasBinService
  ],
  exports: [
    UserRolesService,
    UserRoleRepository,
  ]
})
export class User_RoleModule { }