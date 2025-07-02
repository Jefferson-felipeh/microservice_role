import { CasbinModule } from "./casbin/casbin.module";
import { MenuModule } from "./menus/menus.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { PersonalProfileModule } from "./personal_profile/personal-profile.module";
import { RoleModule } from "./roles/role.module";
import { User_RoleModule } from "./user_roles/user_role.module";

export const modules = [
    RoleModule,
    User_RoleModule,
    CasbinModule,
    MenuModule,
    PermissionsModule,
    PersonalProfileModule
];