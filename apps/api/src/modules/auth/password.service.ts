import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PasswordService {
  async hash(pw: string) { return bcrypt.hash(pw, 10); }
  async verify(pw: string, hash: string) { return bcrypt.compare(pw, hash); }
}
