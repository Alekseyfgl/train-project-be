import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { CatsRepository } from './cats/cat.repository';
import { CatDocument } from './cats/cat.schema';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly catRepository: CatsRepository,
  ) {}

  @Get('cats')
  getCats() {
    return this.catRepository.findAll();
  }

  @Post('cats')
  createCat(@Body() dto: any) {
    return this.catRepository.create(dto);
  }

  @Put('cats')
  async updateCat(@Param('id') id: any) {
    const targetCat: CatDocument = (await this.catRepository.findAll())[0];
    targetCat.setAge(30);
    targetCat.save();
  }
}
