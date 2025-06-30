import { Module } from "@nestjs/common";
import { PermissionsController } from "./permissions.controller";
import { PermissionsService } from "./permissions.service";
import { MenuModule } from "../menus/menus.module";
import { CasbinModule } from "../casbin/casbin.module";

@Module({
  imports: [
    MenuModule,
    CasbinModule
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService] 
})
export class PermissionsModule {}