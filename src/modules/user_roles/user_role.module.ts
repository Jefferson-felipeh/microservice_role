import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "../roles/entities/Role.entity";
import { UserRole } from "./entities/UserRole.entity";
import { UserRolesController } from "./user_role..controller";
import { UserRolesService } from "./user_role.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { UserRoleRepository } from "./repository/userRole.repository";
import { CasBinService } from "../casbin/casbin.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Role,UserRole]),
           //Configuração do clientProxy_
            ClientsModule.register([
              {
                transport: Transport.RMQ,
                name: 'USERS_SERVICE',
                options: {
                  urls: ['amqp://guest:guest@localhost:5672'],
                  queue: 'ms_users',
                  queueOptions: {
                    durable: true
                  }
                }
              }
            ]),
    ],
    controllers: [
      UserRolesController
    ],
    providers: [
      UserRolesService,
      UserRoleRepository,
      CasBinService
    ]
})
export class User_RoleModule{}