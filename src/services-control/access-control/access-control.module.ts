import { Module } from "@nestjs/common";
import { Access_Control_Service } from "./access-control.service";

@Module({
    providers: [
        Access_Control_Service,
    
    ],
    exports: [Access_Control_Service]
})
export class Access_Control_Module{}
