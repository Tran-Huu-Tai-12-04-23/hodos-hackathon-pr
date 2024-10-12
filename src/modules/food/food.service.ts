import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { foods } from 'src/constants/data';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FoodEntity } from 'src/entities/food.entity';
import { callApiHelper } from 'src/helpers/callApiHelper';
import { FoodRepository } from 'src/repositories/food.repository';
import { In, Like } from 'typeorm';
import { FoodFilter } from './dto/food.pagination.dto';

@Injectable()
export class FoodService {
  constructor(
    public readonly configService: ConfigService,
    private readonly repro: FoodRepository,
  ) {}
  GEMINI_API_KEY = this.configService.get<string>('GEMINI_API_KEY') || '';
  MODEL_API_LINK = this.configService.get<string>('MODEL_API_LINK') || '';
  genAI = new GoogleGenerativeAI(this.GEMINI_API_KEY);
  model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async initFood() {
    const isCheckExist = await this.repro.find();

    if (isCheckExist.length > 0) {
      return {};
    }
    for (const food of foods) {
      const foodEntity = new FoodEntity();
      foodEntity.name = food.name;
      foodEntity.description = food.description;
      foodEntity.lstImgs = food.lstImgs.join(',');
      foodEntity.rangePrice = food.rangePrice.join(',');
      foodEntity.label = food.label;
      foodEntity.address = food.address;
      await this.repro.save(foodEntity);
    }
    return {
      message: 'Init food success',
    };
  }

  async find(data: { where: any; skip: number; take: number }) {
    const [result, total] = await this.repro.findAndCount({
      where: data.where,
      skip: data.skip,
      take: data.take,
    });
    return {
      result,
      total,
    };
  }

  async predict(data: { imgUrl: string }) {
    const result = await callApiHelper.callAPI(
      this.MODEL_API_LINK + '/classifyFood',
      {
        image_url: data.imgUrl,
      },
    );

    const lstLocation = await this.repro.find({
      where: {
        label: In(result?.result || []),
      },
    });

    return lstLocation;
  }

  async findAndCountTop(top?: number) {
    const [result, total] = await this.repro.findAndCount({
      order: {
        name: 'ASC',
      },
      take: top || 10,
    });
    return [result, total];
  }

  async pagination(body: PaginationDto<FoodFilter>) {
    const where: any = [];
    if (body.where?.name) {
      where.push({
        name: Like(`%${body.where.name}%`),
        isDeleted: false,
      });
      where.push({
        label: Like(`%${body.where.name}%`),
        isDeleted: false,
      });
      where.push({
        description: Like(`%${body.where.name}%`),
        isDeleted: false,
      });
      where.push({
        address: Like(`%${body.where.name}%`),
        isDeleted: false,
      });
    }

    const [result, total]: any = await this.repro.findAndCount({
      where: where,
      order: body.order,
      skip: body.skip,
      take: body.take,
    });
    for (const food of result) {
      food.img =
        food.lstImgs.split(',')?.length > 0 ? food.lstImgs.split(',')[0] : '';
    }
    return [result, total];
  }
}
