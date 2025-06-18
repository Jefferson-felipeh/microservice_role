import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CasbinRuleEntity } from "./entities/casbin.entity";
import { CasBinService } from "./casbin.service";
import { CasBinGuard } from "./guards/casbin.guard";
import { JwtAuthGuard } from "./guards/jwtAuthGuard.guard";
import { JwtStrategy } from "./strategy/jwtStrategy.strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([CasbinRuleEntity]),
    ],
    providers: [
        CasBinService,
        CasBinGuard,
        JwtAuthGuard,
        JwtStrategy,
    ],
    exports: [
        CasBinService,
        CasBinGuard,
        JwtAuthGuard,
        JwtStrategy
    ]
})
export class CasbinModule{}