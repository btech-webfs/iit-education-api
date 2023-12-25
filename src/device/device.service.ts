import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DeviceService {
  constructor(private prisma: PrismaService) { }

  async create(createDeviceDto: CreateDeviceDto) {
    const newDevice = await this.prisma.device.create({
      data: createDeviceDto
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
      data: updateDeviceDto
    })
    return updatedDevice
  }

  async remove(id: string) {
    const deletedDevice = await this.prisma.device.delete({
      where: { id }
    })
    return deletedDevice
  }
}
