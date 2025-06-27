import { Module } from "@nestjs/common";
import { PermissionsController } from "./permissions.controller";
import { PermissionsService } from "./permissions.service";
import { CasBinService } from "../casbin/casbin.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CasbinRuleEntity } from "../casbin/entities/casbin.entity";
import { ClientsModule } from "@nestjs/microservices";

@Module({
  imports: [
    TypeOrmModule.forFeature([CasbinRuleEntity]), // ← necessário para o repositório
    // e se você tiver um módulo onde MICROSERVICE_USERS está registrado, importe ele aqui também
    
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService, CasBinService],
  exports: [PermissionsService] // caso vá usar em outro módulo
})
export class PermissionsModule {}