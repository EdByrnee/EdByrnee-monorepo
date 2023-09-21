import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptionService {

  saltRounds = 10;

  async hash(secret: string): Promise<string> {
    return await bcrypt.hash(secret, this.saltRounds);
  }

  async compare(secret: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(secret, hash);
  }
}
