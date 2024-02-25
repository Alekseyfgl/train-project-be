import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument, CatModelType } from './cat.schema';

@Injectable()
export class CatsRepository {
  constructor(
    @InjectModel(Cat.name)
    private CatModel: CatModelType,
  ) {}

  async create(createCatDto: any): Promise<CatDocument> {
    const superCat: CatDocument = this.CatModel.createSuperCat(
      'barsik',
      this.CatModel,
    );

    const createdCat = new this.CatModel(createCatDto);
    return createdCat.save();
  }

  findAll(): Promise<CatDocument[]> {
    return this.CatModel.find();
  }

  async save(cat: CatDocument) {
    await cat.save();
  }
}
