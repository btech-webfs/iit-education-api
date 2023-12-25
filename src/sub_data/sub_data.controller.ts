import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SubDataService } from './sub_data.service';
import { CreateSubDatumDto } from './dto/create-sub_datum.dto';
import { UpdateSubDatumDto } from './dto/update-sub_datum.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { unlink } from 'fs';

@Controller('sub-data')
export class SubDataController {
  constructor(private readonly subDataService: SubDataService, private prisma: PrismaService) { }

  @Post()
  create(@Body() createSubDatumDto: CreateSubDatumDto) {
    return this.subDataService.create(createSubDatumDto);
  }

  @Post("upload/:id")
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'uploads/',
      filename(_req, file, callback) {
        callback(
          null,
          Buffer.from(`${uuid()}.${file.mimetype.split("/").slice(-1)[0]}`, 'latin1').toString(
            'utf8',
          ),
        )
      },
    }),
  }))
  upload(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    this.prisma.subData.findUniqueOrThrow({
      where: { id }
    }).catch(_ => unlink(file.path, () => { }))
    return this.subDataService.upload(id, file);
  }

  @Get()
  findAll() {
    return this.subDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subDataService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubDatumDto: UpdateSubDatumDto) {
    return this.subDataService.update(id, updateSubDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subDataService.remove(id);
  }
}
