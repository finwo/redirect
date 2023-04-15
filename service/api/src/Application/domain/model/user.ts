import { AbstractModel } from "@core/abstract-model";
import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from "typeorm"
import { num_iterations } from '@config/authentication';

const { PBKDF2 } = require('@finwo/digest-pbkdf2');
const supercop   = require('supercop');

@Entity()
export class User extends AbstractModel {
  @PrimaryColumn()
  username: string;

  @Column()
  pubkey: string;

  setPassword(password: string): Promise<void> {
    return new Promise(resolve => {
      (new PBKDF2(password, this.username, num_iterations, 32))
        .deriveKey(()=>{}, async (key: string) => {
          const seed  = Buffer.from(key, 'hex');
          const kp    = await supercop.createKeyPair(seed);
          this.pubkey = kp.publicKey.toString('base64');
          resolve();
        });
    });
  }

}
