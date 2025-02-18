import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDatumDto } from './dto/create-datum.dto';
import { UpdateDatumDto } from './dto/update-datum.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Data } from '@prisma/client';
import { unlink } from 'fs';

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
    const foundData = await this.prisma.data.findUnique({
      where: { id }
    })
    if (!foundData) {
      throw new BadRequestException("Data not found")
    } else {
      if (updateDatumDto.gradeIds) {
        if (updateDatumDto.gradeIds.length === 0) {
          await this.prisma.data.update(
            {
              where: { id },
              data: {
                Grades: {
                  disconnect: foundData.gradeIds.map(id => ({ id }))
                },
              }
            }
          )
        } else {
          const disconnectGradeIds = foundData.gradeIds.filter(element => !updateDatumDto.gradeIds.includes(element));
          const connectGradeIds = updateDatumDto.gradeIds.filter(element => !foundData.gradeIds.includes(element));
          if (disconnectGradeIds.length) {
            await this.prisma.data.update(
              {
                where: { id },
                data: {
                  Grades: {
                    disconnect: disconnectGradeIds.map(id => ({ id }))
                  },
                }
              }
            )
          }
          if (connectGradeIds.length) {
            await this.prisma.data.update(
              {
                where: { id },
                data: {
                  Grades: {
                    connect: connectGradeIds.map(id => ({ id }))
                  },
                }
              }
            )
          }
        }
      }
    }

    return await this.prisma.data.update({
      where: { id },
      data: {
        name: updateDatumDto.name,
        thumbnail: updateDatumDto.thumbnail,
        author: updateDatumDto.author,
        uses: updateDatumDto.uses,
        decs: updateDatumDto.decs,
        subjectId: updateDatumDto.subjectId,
        topicId: updateDatumDto.topicId,
        dataTypeId: updateDatumDto.dataTypeId,
      }
    });
  }

  async remove(body: any) {
    const { dataIds } = body;

    const subData = await this.prisma.subData.findMany({
      where: {
        dataId: {
          in: dataIds
        }
      }
    })

    const dataPacks = await this.prisma.dataPack.findMany({
      where: {
        dataIds: {
          hasSome: dataIds
        }
      }
    })

    const grades = await this.prisma.grade.findMany({
      where: {
        dataIds: {
          hasSome: dataIds
        }
      }
    })

    if (subData.length) {
      for await (const sdt of subData) {
        if (sdt.url) {
          unlink(sdt.url, () => { })
        }
      }
      await this.prisma.subData.deleteMany({
        where: {
          id: { in: subData.map(e => e.id) }
        }
      })
    }

    if (dataPacks.length) {
      for await (const dtp of dataPacks) {
        await this.prisma.dataPack.update({
          where: {
            id: dtp.id
          },
          data: {
            Data: {
              disconnect: dataIds.map(e => ({ id: e })),
            }
          }
        })
      }
    }

    if (grades.length) {
      for await (const grd of grades) {
        await this.prisma.grade.update({
          where: {
            id: grd.id
          },
          data: {
            Data: {
              disconnect: dataIds.map(e => ({ id: e })),
            }
          }
        })
      }
    }

    return await this.prisma.data.deleteMany({
      where: {
        id: { in: dataIds }
      }
    },);
  }
}
