import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(protected userRepository: UserRepository) {}

  findUser(id: string) {
    return this.userRepository.findUser();
  }
}
