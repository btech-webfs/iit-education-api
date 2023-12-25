import { Injectable } from '@nestjs/common';
import { CreateClientKeyDto } from './dto/create-client_key.dto';
import { UpdateClientKeyDto } from './dto/update-client_key.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientKeyService {
  constructor(private prisma: PrismaService) { }

  async create(createClientKeyDto: CreateClientKeyDto) {
    const clientKey = await this.prisma.clientKey.create({
      data: createClientKeyDto,
    });
    return clientKey;
  }

  async findAll() {
    const clientKeys = await this.prisma.clientKey.findMany();
    return clientKeys;
  }

  async findOne(id: string) {
    const foundKey = await this.prisma.clientKey.findUnique({
      where: {
        id,
      },
    });
    return foundKey;
  }

  async update(id: string, updateClientKeyDto: UpdateClientKeyDto) {
    try {
      const updatedKey = await this.prisma.clientKey.update({
        where: {
          id,
        },
        data: updateClientKeyDto,
      });
      return updatedKey;
    } catch (error) {
      return error;
    }
  }

  async remove(id: string) {
    try {
      const deletedKey = await this.prisma.clientKey.delete({
        where: {
          id,
        },
      });
      return deletedKey;
    } catch (error) {
      return error;
    }
  }
}
