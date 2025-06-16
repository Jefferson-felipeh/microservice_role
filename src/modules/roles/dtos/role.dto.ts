import { CommonDto } from "src/common/dtos/common.dto"
import { UserRole } from "src/modules/user_roles/entities/UserRole.entity"

export class RoleDto extends CommonDto{
    role: string
    userRole: UserRole[]
}