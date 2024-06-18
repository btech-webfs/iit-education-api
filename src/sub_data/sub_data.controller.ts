import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { unlink } from 'fs';
import { diskStorage } from 'multer';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';
import { CreateSubDatumDto } from './dto/create-sub_datum.dto';
import { SubDataService } from './sub_data.service';
import { Public } from '../auth/decorators/public.decorator';

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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSubDatumDto: UpdateSubDatumDto) {
  //   return this.subDataService.update(id, updateSubDatumDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subDataService.remove(id);
  }

  @Get('stream/:file')
  @Public()
  getFile(@Param("file") file: string) {
    return this.subDataService.streamFile(file);
  }
}
