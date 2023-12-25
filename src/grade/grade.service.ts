import { Injectable } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GradeService {
  constructor(private prisma: PrismaService) { }

  async create(createGradeDto: CreateGradeDto) {
    const newGrade = await this.prisma.grade.create({
      data: createGradeDto
    })
    return newGrade
  }

  async findAll() {
    const grades = await this.prisma.grade.findMany()
    return grades
  }

  async findOne(id: string) {
    const foundGrade = await this.prisma.grade.findUnique({
      where: {
        id
      }
    })
    return foundGrade;
  }

  async update(id: string, updateGradeDto: UpdateGradeDto) {
    const updatedGrade = await this.prisma.grade.update(
      {
        where: { id },
        data: updateGradeDto
      }
    )
    return updatedGrade
  }

  async remove(id: string) {
    const deletedGrade = await this.prisma.grade.delete({
      where: { id }
    })
    return deletedGrade;
  }
}
