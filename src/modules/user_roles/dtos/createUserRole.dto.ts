import { CommonDto } from "src/common/dtos/common.dto"
import { Role } from "src/modules/roles/entities/Role.entity"

export class UserRoleDto extends CommonDto{
    userid: string
    role:Role
}