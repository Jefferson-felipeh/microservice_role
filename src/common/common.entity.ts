import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('common-entity-role')
export class CommonEntityRole {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn({name: 'CREATEDAT',type: Date})
    createdAt: Date

    @UpdateDateColumn({name: 'UPDATEDAT',type: Date})
    updatedAt:Date
}