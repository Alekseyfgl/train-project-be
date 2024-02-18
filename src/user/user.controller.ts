import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(protected userService: UserService) {}
  @Get()
  getUsers() {
    return this.userService.findUser('1');
  }

  @Post()
  createUser(@Body() inputModel: CreateUserType) {
    return [{ id: 1, name: inputModel.name }];
  }
}

type CreateUserType = {
  name: string;
};
