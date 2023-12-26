import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DataPackService } from './data_pack.service';
import { CreateDataPackDto } from './dto/create-data_pack.dto';

@Controller('data-pack')
export class DataPackController {
  constructor(private readonly dataPackService: DataPackService) { }

  @Post()
  create(@Body() createDataPackDto: CreateDataPackDto) {
    return this.dataPackService.create(createDataPackDto);
  }

  @Get()
  findAll() {
    return this.dataPackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dataPackService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDataPackDto: UpdateDataPackDto) {
  //   return this.dataPackService.update(id, updateDataPackDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dataPackService.remove(id);
  }
}
