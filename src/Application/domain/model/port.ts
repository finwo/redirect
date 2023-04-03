import { AbstractModel } from "@core/abstract-model";
import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity()
export class Port extends AbstractModel {
    @PrimaryColumn()
    ingress: string; // Contains hostname + path + get params

    @Column()
    egress: string; // https://example.com/path?static=foobar&origin={{ingress.url}}
}
