import { BadGatewayException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientKeyDto } from './dto/create-client_key.dto';
import { UpdateClientKeyDto } from './dto/update-client_key.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientKey } from '@prisma/client';

@Injectable()
export class ClientKeyService {
  constructor(private prisma: PrismaService) { }

  async create(createClientKeyDto: CreateClientKeyDto): Promise<ClientKey | null> {
    try {
      return this.prisma.clientKey.create({
        data: {
          key: createClientKeyDto.key,
          decs: createClientKeyDto.decs,
          limit: createClientKeyDto.limit,
          expirationDate: createClientKeyDto.expirationDate ? new Date(createClientKeyDto.expirationDate) : createClientKeyDto.expirationDate,
          DataPacks: createClientKeyDto.dataPackIds && (createClientKeyDto.dataPackIds.length ? {
            connect: createClientKeyDto.dataPackIds.map(id => ({ id }))
          } : undefined),
          Devices: createClientKeyDto.deviceIds && (createClientKeyDto.deviceIds.length ? {
            connect: createClientKeyDto.deviceIds.map(id => ({ id }))
          } : undefined),
        },
      });
    } catch (error) {
      return error;
    }
  }

  async createRandom(createClientKeyDto: CreateClientKeyDto): Promise<any | null> {
    try {
      const keys: string[] = [...new Set(Array.from({ length: createClientKeyDto.randomKeys }, (v, i) => Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36)))];
      const duplicates = await this.prisma.clientKey.findMany({
        where: {
          key: {
            in: keys
          }
        }
      });
      if (duplicates.length) {
        throw new ConflictException('Some key is invalid please try again');
      } else {
        const postsData = keys.map(e => ({
          key: e,
          decs: createClientKeyDto.decs,
          limit: createClientKeyDto.limit,
          expirationDate: createClientKeyDto.expirationDate ? new Date(createClientKeyDto.expirationDate) : createClientKeyDto.expirationDate,
        }));
        await this.prisma.clientKey.createMany({
          data: postsData
        });
        const createdKeys = await this.prisma.clientKey.findMany({
          where: {
            key: {
              in: keys,
            }
          }
        });

        if (createClientKeyDto.dataPackIds && createdKeys.length) {
          for await (let packId of createClientKeyDto.dataPackIds) {
            await this.prisma.dataPack.update({
              where: {
                id: packId
              }, data: {
                ClientKeys: {
                  connect: createdKeys.map(e => ({ id: e.id }))
                }
              }
            })
          }
        }
        return {
          keys,
          createdKeys
        };
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findAll(): Promise<ClientKey[] | []> {
    return this.prisma.clientKey.findMany();
  }

  async findOne(id: string): Promise<ClientKey | null> {
    return this.prisma.clientKey.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateClientKeyDto: UpdateClientKeyDto): Promise<ClientKey | null> {
    return this.prisma.clientKey.update({
      where: {
        id,
      },
      data: {
        key: updateClientKeyDto.key,
        limit: updateClientKeyDto.limit,
        decs: updateClientKeyDto.decs,
        expirationDate: updateClientKeyDto.expirationDate ? new Date(updateClientKeyDto.expirationDate) : updateClientKeyDto.expirationDate,
        DataPacks: updateClientKeyDto.dataPackIds && (updateClientKeyDto.dataPackIds.length ? {
          connect: updateClientKeyDto.dataPackIds.map(id => ({ id }))
        } : {
          set: []
        }),
        Devices: updateClientKeyDto.deviceIds && (updateClientKeyDto.deviceIds.length ? {
          connect: updateClientKeyDto.deviceIds.map(id => ({ id }))
        } : {
          set: []
        }),
      },
    })
  }

  async updateMany(updateClientKeyDto: UpdateClientKeyDto): Promise<any | null> {
    const keys = await this.prisma.clientKey.findMany({
      where: {
        key: {
          in: updateClientKeyDto.keys
        }
      }
    });
    if (updateClientKeyDto.dataPackIds.length && keys.length) {
      return this.prisma.dataPack.update({
        where: {
          id: updateClientKeyDto.dataPackIds[0]
        },
        data: {
          ClientKeys: {
            connect: keys.map(e => ({ id: e.id })),
          }
        }
      });
    } else {
      return []
    }
  }

  async remove(id: string): Promise<ClientKey | null> {
    const dataPacks = await this.prisma.dataPack.findMany({
      where: {
        clientKeyIds: {
          has: id
        }
      }
    })

    const devices = await this.prisma.device.findMany({
      where: {
        clientKeyIds: {
          has: id
        }
      }
    })

    if (dataPacks?.length) {
      for await (const dtP of dataPacks) {
        await this.prisma.dataPack.update(
          {
            where: { id: dtP.id },
            data: {
              ClientKeys: {
                disconnect: { id }
              }
            }
          }
        )
      }
    }

    if (devices?.length) {
      for await (const dv of devices) {
        await this.prisma.device.update(
          {
            where: { id: dv.id },
            data: {
              ClientKeys: {
                disconnect: { id }
              }
            }
          }
        )
      }
    }

    return this.prisma.clientKey.delete({
      where: { id }
    })
  }

  async removeMany(updateClientKeyDto: UpdateClientKeyDto) {
    if (updateClientKeyDto.keys && updateClientKeyDto.keys.length) {
      const foundKeys = await this.prisma.clientKey.findMany({
        where: {
          id: {
            in: updateClientKeyDto.keys
          }
        }
      })
      if (!foundKeys.length) {
        throw new NotFoundException("Keys not found!");
      } else {
        const dataPackIds: any = [... new Set(Array.prototype.concat.apply([], foundKeys.map(k => k.dataPackIds)))]
        const deviceIds: any = [... new Set(Array.prototype.concat.apply([], foundKeys.map(k => k.deviceIds)))]
        if (dataPackIds.length) {
          for await (let packId of dataPackIds) {
            await this.prisma.dataPack.update({
              where: {
                id: packId
              }, data: {
                ClientKeys: {
                  disconnect: foundKeys.map(e => ({ id: e.id }))
                }
              }
            })
          }
        }
        if (deviceIds.length) {
          for await (let deviceId of deviceIds) {
            await this.prisma.device.update({
              where: {
                id: deviceId
              }, data: {
                ClientKeys: {
                  disconnect: foundKeys.map(e => ({ id: e.id }))
                }
              }
            })
          }
        }
        return this.prisma.clientKey.deleteMany({
          where: {
            id: {
              in: updateClientKeyDto.keys
            }
          }
        })
      }
    } else {
      throw new BadGatewayException("Keys is require and not empty!");
    }
  }
}
