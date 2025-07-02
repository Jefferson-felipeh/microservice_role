import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CasbinRuleEntity } from "./entities/casbin.entity";
import { CasBinService } from "./casbin.service";
import { CasBinGuard } from "./guards/casbin.guard";
import { JwtAuthGuard } from "./guards/jwtAuthGuard.guard";
import { JwtStrategy } from "./strategy/jwtStrategy.strategy";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CasbinController } from "./casbin.controller";
import { EnforcerService } from "./helpers/enforcer.service";
import { PolicyService } from "./helpers/policy.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([CasbinRuleEntity]),
        /*
            OBS: Eu estou configurando o clientProxy para enviar mensagem send() para o microservice de usuários,
            e estou chamando ou usando o client(MICROSERVICE_USERS) dentro do service desse módulo,
            e devido a isso, todo módulo que utilizar esse service, como CasbinService que esta usando o ClientProxy 
            para enviar um send() para o microservice_users, precisará importar esse ClientsModule, para isso,
            eu exporto o ClientsModule como esta sendo feito abaixo, e nos outros módulos, como o RoleModule, eu importo
            o CasbinModule no imports:[]_
        */
        ClientsModule.register([
            {
                transport: Transport.RMQ,
                name: 'MICROSERVICE_USERS',
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
    controllers: [CasbinController],
    providers: [
        CasBinService,
        PolicyService,
        CasBinGuard,
        JwtAuthGuard,
        JwtStrategy,
        
    ],
    exports: [
        CasBinService,
        PolicyService,
        CasBinGuard,
        JwtAuthGuard,
        JwtStrategy,
        ClientsModule
    ]
})
export class CasbinModule { }