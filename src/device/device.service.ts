import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DeviceService {
  constructor(private prisma: PrismaService) { }

  async create(createDeviceDto: CreateDeviceDto) {
    const newDevice = await this.prisma.device.create({
      data: {
        duid: createDeviceDto.duid,
        tv: createDeviceDto.tv,
        ClientKeys: createDeviceDto.clientKeyIds && (createDeviceDto.clientKeyIds.length ? {
          connect: createDeviceDto.clientKeyIds.map(id => ({ id }))
        } : undefined)
      }
    })
    return newDevice
  }

  async findAll() {
    const devices = await this.prisma.device.findMany()
    return devices
  }

  async findOne(id: string) {
    const foundDevice = await this.prisma.device.findUnique({
      where: {
        id
      }
    })
    return foundDevice
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto) {
    const updatedDevice = await this.prisma.device.update({
      where: { id },
      data: {
        duid: updateDeviceDto.duid,
        tv: updateDeviceDto.tv,
        ClientKeys: updateDeviceDto.clientKeyIds && (updateDeviceDto.clientKeyIds.length ? {
          connect: updateDeviceDto.clientKeyIds.map(id => ({ id }))
        } : {
          set: []
        })
      }
    })
    return updatedDevice
  }

  async remove(id: string) {
    const clientKeys = await this.prisma.clientKey.findMany({
      where: {
        deviceIds: {
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
              Devices: {
                disconnect: { id }
              }
            }
          }
        )
      }
    }

    const deletedDevice = await this.prisma.device.delete({
      where: { id },
    })
    return deletedDevice
  }
}
