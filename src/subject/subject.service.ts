import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) { }

  async create(createSubjectDto: CreateSubjectDto) {
    const newSubject = await this.prisma.subject.create(
      {
        data: createSubjectDto
      }
    )
    return newSubject
  }

  async findAll() {
    const subjects = await this.prisma.subject.findMany()
    return subjects
  }

  async findOne(id: string) {
    const foundSubject = await this.prisma.subject.findUnique(
      {
        where: { id }
      }
    )
    return foundSubject;
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    const updatedSubject = await this.prisma.subject.update({
      where: { id },
      data: updateSubjectDto
    })
    return updatedSubject
  }

  async remove(id: string) {
    const deletedSubject = await this.prisma.subject.delete({
      where: { id },
    })
    return deletedSubject
  }
}
