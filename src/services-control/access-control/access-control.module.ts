import { Module } from "@nestjs/common";
import { Access_Control_Service } from "./access-control.service";
import { CasBinService } from "src/modules/casbin/casbin.service";
import { UserRoleRepository } from "src/modules/user_roles/repository/userRole.repository";

@Module({
    providers: [
        Access_Control_Service,
        CasBinService,
        UserRoleRepository
    ],
    exports: [Access_Control_Service]
})
export class Access_Control_Module{}
