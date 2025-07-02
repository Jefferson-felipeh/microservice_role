import { Module } from "@nestjs/common";
import { PermissionsController } from "./permissions.controller";
import { PermissionsService } from "./permissions.service";
import { MenuModule } from "../menus/menus.module";
import { CasbinModule } from "../casbin/casbin.module";
import { PolicyService } from "../casbin/helpers/policy.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CasbinRuleEntity } from "../casbin/entities/casbin.entity";
import { PersonalProfileModule } from "../personal_profile/personal-profile.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([CasbinRuleEntity]),
    MenuModule,
    CasbinModule,
    PersonalProfileModule
  ],
  controllers: [
    PermissionsController
  ],
  providers: [
    PermissionsService,
    PolicyService
  ],
  exports: [
    PermissionsService,
  ] 
})
export class PermissionsModule {}