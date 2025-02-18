import { BadRequestException, Injectable } from '@nestjs/common';
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
    let foundDataPack = await this.prisma.dataPack.findUnique({ where: { id: id } });
    if (!foundDataPack) {
      throw new BadRequestException("Data Package not found")
    } else {
      // Update name
      if (updateDataPackDto.name) {
        await this.prisma.dataPack.update(
          {
            where: { id },
            data: {
              name: updateDataPackDto.name
            }
          })
      }
      // Update DataIds
      if (updateDataPackDto.dataIds) {
        if (updateDataPackDto.dataIds.length === 0) {
          await this.prisma.dataPack.update(
            {
              where: { id },
              data: {
                Data: {
                  disconnect: foundDataPack.dataIds.map(id => ({ id }))
                },
              }
            }
          )
        } else {
          const disconnectdataIds = foundDataPack.dataIds.filter(element => !updateDataPackDto.dataIds.includes(element));
          const connectdataIds = updateDataPackDto.dataIds.filter(element => !foundDataPack.dataIds.includes(element));
          if (disconnectdataIds.length) {
            await this.prisma.dataPack.update(
              {
                where: { id },
                data: {
                  Data: {
                    disconnect: disconnectdataIds.map(id => ({ id }))
                  },
                }
              }
            )
          }
          if (connectdataIds.length) {
            await this.prisma.dataPack.update(
              {
                where: { id },
                data: {
                  Data: {
                    connect: connectdataIds.map(id => ({ id }))
                  },
                }
              }
            )
          }
        }
      }
      // Update ClientKeyIds
      if (updateDataPackDto.clientKeyIds) {
        if (updateDataPackDto.clientKeyIds.length === 0) {
          await this.prisma.dataPack.update(
            {
              where: { id },
              data: {
                ClientKeys: {
                  disconnect: foundDataPack.clientKeyIds.map(id => ({ id }))
                },
              }
            }
          )
        } else {
          const disconnectclientKeyIds = foundDataPack.clientKeyIds.filter(element => !updateDataPackDto.clientKeyIds.includes(element));
          const connectclientKeyIds = updateDataPackDto.clientKeyIds.filter(element => !foundDataPack.clientKeyIds.includes(element));
          if (disconnectclientKeyIds.length) {
            await this.prisma.dataPack.update(
              {
                where: { id },
                data: {
                  ClientKeys: {
                    disconnect: disconnectclientKeyIds.map(id => ({ id })),
                  },
                }
              }
            )
          }
          if (connectclientKeyIds.length) {
            await this.prisma.dataPack.update(
              {
                where: { id },
                data: {
                  ClientKeys: {
                    connect: connectclientKeyIds.map(id => ({ id }))
                  },
                }
              }
            )
          }
        }
      }

      return await this.prisma.dataPack.findUnique({ where: { id: id } });
    }
  }

  async copy(id: string, updateDataPackDto: UpdateDataPackDto) {
    let foundDataPack = await this.prisma.dataPack.findUnique({ where: { id: id } });
    if (!foundDataPack) {
      throw new BadRequestException("Data Package not found")
    } else {
      if (updateDataPackDto.fromDataPackId) {
        let foundFromDataPack = await this.prisma.dataPack.findUnique({ where: { id: updateDataPackDto.fromDataPackId } });
        foundDataPack = await this.prisma.dataPack.update(
          {
            where: { id },
            data: {
              Data: {
                connect: foundFromDataPack.dataIds.map(id => ({ id })),
              },
            }
          }
        )
      } else {
        throw new BadRequestException("Copy Data Package not found")
      }
    }
    return foundDataPack;
  }

  async remove(id: string) {
    const clientKeys = await this.prisma.clientKey.findMany({
      where: {
        dataPackIds: {
          has: id
        }
      }
    })

    if (clientKeys?.length) {
      for await (const clK of clientKeys) {
        await this.prisma.clientKey.update(
          {
            where: { id: clK.id },
            data: {
              DataPacks: {
                disconnect: { id }
              }
            }
          }
        )
      }
    }
    return this.prisma.dataPack.delete(
      {
        where: { id }
      }
    )
  }
}
