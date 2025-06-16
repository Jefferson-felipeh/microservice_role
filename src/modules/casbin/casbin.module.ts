import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CasbinRuleEntity } from "./entities/casbin.entity";
import { CasBinService } from "./casbin.service";
import { CasBinGuard } from "./guards/casbin.guard";
import { JwtAuthGuard } from "./guards/jwtAuthGuard.guard";
import { JwtStrategy } from "./strategy/jwtStrategy.strategy";

@Module({
    imports: [
        //Instanciando ou referenciando a entidade ao typeorm_
        TypeOrmModule.forFeature([CasbinRuleEntity])
    ],
    providers: [
        //Service do casbin resposável por expecificar o path do arquivo model.conf para configuração das regras do banco de dados;
        CasBinService,
        //Guard que vai capturar os dados da requisição e verificar as partes essenciais_
        CasBinGuard,
        JwtAuthGuard,
        JwtStrategy
    ],
    exports: [//Exportando para outros módulos_
        CasBinService,
        CasBinGuard,
        JwtAuthGuard,
        JwtStrategy
    ]
})
export class CasbinModule{}