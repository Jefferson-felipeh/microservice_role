import { CommonEntityRole } from "src/common/common.entity";
import { Column, Entity } from "typeorm";

@Entity('menu')
export class Menu extends CommonEntityRole{
    @Column()
    label:string

    @Column()
    path:string

    @Column()
    icon:string

    @Column()
    permission:string

    @Column({nullable: true})
    ordem:number

    @Column({default: true})
    active:boolean
}