import { Injectable } from '@nestjs/common';
import { CreateDataPackDto } from './dto/create-data_pack.dto';
import { UpdateDataPackDto } from './dto/update-data_pack.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DataPackService {
  constructor(private prisma: PrismaService) { }

  async create(createDataPackDto: CreateDataPackDto) {
    const newDataPack = await this.prisma.dataPack.create(
      { data: createDataPackDto }
    )
    return newDataPack;
  }

  async findAll() {
    const dataPacks = await this.prisma.dataPack.findMany()
    return dataPacks;
  }

  async findOne(id: string) {
    const foundDataPack = this.prisma.dataPack.findUnique(
      {
        where: { id }
      }
    )
    return foundDataPack
  }

  async update(id: string, updateDataPackDto: UpdateDataPackDto) {
    const updatedDataPack = await this.prisma.dataPack.update(
      {
        where: { id },
        data: updateDataPackDto
      }
    )
    return updatedDataPack
  }

  async remove(id: string) {
    const deletedDataPack = await this.prisma.dataPack.delete(
      {
        where: { id }
      }
    )
    return deletedDataPack
  }
}
