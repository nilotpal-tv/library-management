import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { HashingService } from './hashing.service';

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string, round?: number): Promise<string> {
    const salt = await genSalt(round && round >= 10 ? round : 13);
    return hash(data, salt);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
