import { Injectable } from '@nestjs/common';
import { CreateClientKeyDto } from './dto/create-client_key.dto';
import { UpdateClientKeyDto } from './dto/update-client_key.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientKey } from '@prisma/client';

@Injectable()
export class ClientKeyService {
  constructor(private prisma: PrismaService) { }

  async create(createClientKeyDto: CreateClientKeyDto): Promise<ClientKey | null> {
    return this.prisma.clientKey.create({
      data: {
        key: createClientKeyDto.key,
        limit: createClientKeyDto.limit,
        DataPacks: createClientKeyDto.dataPackIds && (createClientKeyDto.dataPackIds.length ? {
          connect: createClientKeyDto.dataPackIds.map(id => ({ id }))
        } : undefined),
        Devices: createClientKeyDto.deviceIds && (createClientKeyDto.deviceIds.length ? {
          connect: createClientKeyDto.deviceIds.map(id => ({ id }))
        } : undefined),
      },
    });
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
}
