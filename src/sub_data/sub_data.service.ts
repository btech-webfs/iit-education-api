import { Injectable, StreamableFile } from '@nestjs/common';
import { CreateSubDatumDto } from './dto/create-sub_datum.dto';
import { UpdateSubDatumDto } from './dto/update-sub_datum.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubData } from '@prisma/client';
import { unlink, createReadStream } from 'fs';
import { join } from "path";

@Injectable()
export class SubDataService {
  constructor(private prisma: PrismaService) { }

  async create(createSubDatumDto: CreateSubDatumDto): Promise<SubData | null> {
    return this.prisma.subData.create({
      data: {
        name: createSubDatumDto.name,
        decs: createSubDatumDto.decs,
        Data: {
          connect: {
            id: createSubDatumDto.dataId
          }
        }
      }
    })
  }

  async upload(id: string, file: Express.Multer.File): Promise<SubData | null> {
    await this.prisma.subData.findUnique(
      {
        where: { id },
      }
    ).then(data => {
      if (data && data.url) {
        unlink(data.url, () => { })
      }
    })

    return this.prisma.subData.update(
      {
        where: { id },
        data: {
          url: file.path
        }
      }
    );
  }

  async findAll(): Promise<SubData[] | []> {
    return this.prisma.subData.findMany();
  }

  async findOne(id: string): Promise<SubData | null> {
    return this.prisma.subData.findUnique({
      where: { id }
    });
  }

  async update(id: string, updateSubDatumDto: UpdateSubDatumDto): Promise<SubData | null> {
    return this.prisma.subData.update({
      where: { id },
      data: {
        name: updateSubDatumDto.name,
        decs: updateSubDatumDto.decs,
        Data: updateSubDatumDto.dataId ? {
          connect: {
            id: updateSubDatumDto.dataId
          }
        } : undefined
      }
    })
  }

  async remove(id: string): Promise<SubData | null> {
    return this.prisma.subData.delete({
      where: { id }
    }).then(subData => {
      if (subData.url) {
        unlink(subData.url, () => { })
      }
      return subData
    });
  }

  async streamFile(file: string): Promise<StreamableFile> {
    const _file = createReadStream(join(process.cwd(), `uploads/${file}`));
    return new StreamableFile(_file);
  }
}
