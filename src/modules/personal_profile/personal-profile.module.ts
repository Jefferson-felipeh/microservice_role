import { Module } from "@nestjs/common";
import { PersonalProfileController } from "./personal-profile.controller";
import { PersonalProfileService } from "./personal-profile.service";
import { PersonalProfileRepository } from "./repository/personal-profile.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonalProfileEntity } from "./entities/Personal.entity";
import { CasbinRuleEntity } from "../casbin/entities/casbin.entity";
import { CasBinService } from "../casbin/casbin.service";
import { PolicyService } from "../casbin/helpers/policy.service";
import { CasbinModule } from "../casbin/casbin.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([PersonalProfileEntity,CasbinRuleEntity]),
        CasbinModule
    ],
    controllers: [PersonalProfileController],
    providers: [
        PersonalProfileService,
        PersonalProfileRepository,
        CasBinService,
        PolicyService
    ],
    exports: [
        PersonalProfileService,
        PersonalProfileRepository
    ]
})
export class PersonalProfileModule{}