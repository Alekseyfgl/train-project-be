import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  findUser() {
    return { id: 1 };
  }
}
