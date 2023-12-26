import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { GradeService } from './grade.service';

@Controller('grade')
export class GradeController {
  constructor(private readonly gradeService: GradeService) { }

  @Post()
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradeService.create(createGradeDto);
  }

  @Get()
  findAll() {
    return this.gradeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradeService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGradeDto: UpdateGradeDto) {
  //   return this.gradeService.update(id, updateGradeDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gradeService.remove(id);
  }
}
