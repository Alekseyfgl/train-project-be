import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
  _id: Types.ObjectId;
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  breed: string;

  setAge(newAge: number) {
    if (newAge <= 0) throw new Error('Bag age value. Should be more 0');
    this.age = newAge;
  }

  static createSuperCat(name: string, CatModel: CatModelType): CatDocument {
    const createdCat: CatDocument = new CatModel({});

    createdCat.setAge(20);
    return createdCat;
  }
}

export const CatSchema = SchemaFactory.createForClass(Cat);

CatSchema.methods = {
  setAge: Cat.prototype.setAge,
};

const catStaticMethods: CatModelStaticType = {
  createSuperCat: Cat.createSuperCat,
};

CatSchema.statics = catStaticMethods;

export type CatModelStaticType = {
  createSuperCat: (name: string, CatModel: CatModelType) => CatDocument;
};
export type CatModelType = Model<CatDocument> & CatModelStaticType;
