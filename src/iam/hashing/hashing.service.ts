import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
  abstract hash(data: string, round?: number): Promise<string>;
  abstract compare(data: string, encrypted: string): Promise<boolean>;
}
