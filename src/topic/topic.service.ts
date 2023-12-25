import { Injectable } from '@nestjs/common';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Topic } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTopicDto } from './dto/create-topic.dto';

@Injectable()
export class TopicService {
  constructor(private prisma: PrismaService) { }

  async create(createTopicDto: CreateTopicDto) {
    return await this.prisma.topic.create({
      data: {
        name: createTopicDto.name,
        Subject: {
          connect: {
            id: createTopicDto.subjectId
          }
        },
      },
    })
  }

  async findAll(): Promise<Topic[] | []> {
    return this.prisma.topic.findMany()
  }

  async findOne(id: string): Promise<Topic | null> {
    return this.prisma.topic.findUnique({
      where: { id }
    })
  }

  async update(id: string, updateTopicDto: UpdateTopicDto): Promise<Topic | null> {
    return this.prisma.topic.update({
      where: { id },
      data: {
        name: updateTopicDto.name,
        Subject: updateTopicDto.subjectId && {
          connect: {
            id: updateTopicDto.subjectId
          }
        },
      }
    });
  }

  async remove(id: string): Promise<Topic | null> {
    return this.prisma.topic.delete({
      where: { id }
    });
  }
}
