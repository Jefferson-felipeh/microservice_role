import { CasbinModule } from "./casbin/casbin.module";
import { RoleModule } from "./roles/role.module";
import { User_RoleModule } from "./user_roles/user_role.module";

export const modules = [
    RoleModule,
    User_RoleModule,
    CasbinModule
];