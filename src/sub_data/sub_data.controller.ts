import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { unlink } from 'fs';
import { diskStorage } from 'multer';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';
import { CreateSubDatumDto } from './dto/create-sub_datum.dto';
import { UpdateSubDatumDto } from './dto/update-sub_datum.dto';
import { CreateManySubDatumDto } from './dto/create_many-sub_datum.dto';
import { SubDataService } from './sub_data.service';
import { Public } from '../auth/decorators/public.decorator';
import { Response } from 'express';

@Controller('sub-data')
export class SubDataController {
  constructor(private readonly subDataService: SubDataService, private prisma: PrismaService) { }

  @Post()
  create(@Body() createSubDatumDto: CreateSubDatumDto) {
    return this.subDataService.create(createSubDatumDto);
  }

  @Post("/create-many")
  createMany(@Body() createManySubDatumDto: CreateManySubDatumDto) {
    return this.subDataService.createMany(createManySubDatumDto);
  }

  @Post("upload/:id")
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'uploads/',
      filename(_req, file, callback) {
        callback(
          null,
          Buffer.from(`${uuid()}.${file.originalname.split(".").slice(-1)[0]}`, 'latin1').toString(
            'utf8',
          ),
        )
      },
    }),
    limits: { fileSize: 200 * 1024 * 1024 },
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

  @Get('stream/:file')
  @Public()
  getFile(@Param("file") file: string, @Res() res: Response) {
    return this.subDataService.streamFile(file, res);
  }
}
