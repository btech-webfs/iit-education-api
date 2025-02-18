import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import * as fs from 'fs';
import * as path from 'path'
import { diskStorage, memoryStorage } from 'multer';
import { unlink } from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService, private prisma: PrismaService) { }
  private uploadDir = './uploads/';

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileUploadService.handleFileUpload(file);
  }

  @Post('chunk')
  @UseInterceptors(
    FileInterceptor('chunk', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024,
      }
    })
  )
  async uploadChunk(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { chunkIndex: string; totalChunks: string; fileName: string, id: string },
  ) {
    const { chunkIndex, totalChunks, fileName, id } = body;
    const chunkBuffer = file.buffer; // Nhận buffer từ file

    // Đường dẫn tạm thời để lưu chunk
    const chunkTempPath = path.join(this.uploadDir, `${fileName}.part.${chunkIndex}`);
    fs.writeFileSync(chunkTempPath, chunkBuffer);

    console.log(`Receiving chunk ${parseInt(chunkIndex) + 1}/${totalChunks}`);

    // Nếu đã nhận hết tất cả các chunk, ghép chúng lại
    if (parseInt(chunkIndex) === parseInt(totalChunks) - 1) {
      const foundSubData = await this.prisma.subData.findUnique({
        where: { id }
      });
      if (foundSubData && foundSubData.url) {
        unlink(foundSubData.url, () => { })
      }
      return await this.mergeChunks(fileName, totalChunks, id);
    }

    return { message: `Chunk ${chunkIndex} uploaded successfully` };
  }

  // Ghép các chunk lại thành file hoàn chỉnh
  private async mergeChunks(fileName: string, totalChunks: string, id: string) {
    const chunks = [];

    // Đọc từng chunk
    for (let i = 0; i < parseInt(totalChunks); i++) {
      const chunkPath = path.join(this.uploadDir, `${fileName}.part.${i}`);
      chunks.push(fs.promises.readFile(chunkPath));
    }

    const bufferChunks = await Promise.all(chunks);
    const finalBuffer = Buffer.concat(bufferChunks);

    // Tạo file hoàn chỉnh sau khi ghép các chunk
    const finalFilePath = path.join(this.uploadDir, fileName);
    await fs.promises.writeFile(finalFilePath, finalBuffer);

    // Xóa các chunk tạm
    for (let i = 0; i < parseInt(totalChunks); i++) {
      const chunkPath = path.join(this.uploadDir, `${fileName}.part.${i}`);
      await fs.promises.unlink(chunkPath);
    }

    return this.fileUploadService.handleUpdateSubdata(id, finalFilePath);
  }
}