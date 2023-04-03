import { AbstractModel } from "@core/abstract-model";
import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity()
export class User extends AbstractModel {
    @PrimaryColumn()
    username: string;

    @Column()
    pubkey: string;
}
