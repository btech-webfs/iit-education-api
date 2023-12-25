import { Injectable } from '@nestjs/common';
import { CreateDatumDto } from './dto/create-datum.dto';
import { UpdateDatumDto } from './dto/update-datum.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Data } from '@prisma/client';

@Injectable()
export class DataService {
  constructor(private prisma: PrismaService) { }

  async create(createDatumDto: CreateDatumDto): Promise<Data | null> {
    return this.prisma.data.create({
      data: {
        Subject: {
          connect: {
            id: createDatumDto.subjectId
          }
        },
        Topic: {
          connect: {
            id: createDatumDto.topicId
          }
        },
        Grades: {
          connect: createDatumDto.gradeIds.map(id => ({ id }))
        },
        Type: {
          connect: {
            id: createDatumDto.dataTypeId
          }
        },
        DataPacks: {
          connect: createDatumDto.dataPackIds.map(id => ({ id }))
        },
        name: createDatumDto.name,
        thumbnail: createDatumDto.thumbnail,
        author: createDatumDto.author,
        uses: createDatumDto.uses,
        decs: createDatumDto.decs,
      }
    })
  }

  async findAll(): Promise<Data[] | []> {
    return this.prisma.data.findMany();
  }

  async findOne(id: string): Promise<Data | null> {
    return this.prisma.data.findUnique({
      where: { id }
    });
  }

  async update(id: string, updateDatumDto: UpdateDatumDto): Promise<Data | null> {
    return this.prisma.data.update({
      where: { id },
      data: {
        Subject: updateDatumDto.subjectId && {
          connect: {
            id: updateDatumDto.subjectId
          }
        },
        Topic: updateDatumDto.topicId && {
          connect: {
            id: updateDatumDto.topicId
          }
        },
        Grades: updateDatumDto.gradeIds ? {
          connect: updateDatumDto.gradeIds.map(id => ({ id }))
        } : {
          set: []
        },
        Type: {
          connect: updateDatumDto.dataTypeId && {
            id: updateDatumDto.dataTypeId
          }
        },
        DataPacks: updateDatumDto.dataPackIds.length ? {
          connect: updateDatumDto.dataPackIds.map(id => ({ id }))
        } : {
          set: []
        },
        name: updateDatumDto.name,
        thumbnail: updateDatumDto.thumbnail,
        author: updateDatumDto.author,
        uses: updateDatumDto.uses,
        decs: updateDatumDto.decs,
      }
    });
  }

  async remove(id: string): Promise<Data | null> {
    return this.prisma.data.delete({
      where: { id }
    });
  }
}
