import { CommonEntityRole } from "src/common/common.entity";
import { Column, Entity } from "typeorm";

@Entity('personal')
export class PersonalProfileEntity extends CommonEntityRole{
    @Column({name: 'LABEL',type:'varchar',nullable: false})
    label:string

    @Column({name: 'PATH',type:'varchar',nullable: false})
    path:string

    @Column({name: 'PERMISSION',type:'varchar',nullable: false})
    permission:string

    @Column({name: 'ORDER',type:'int',nullable: false,default: 0})
    order:number
}