import { Injectable, StreamableFile } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) { }

  getHello(): string {
    return 'Hello World!';
  }

  async streamFile(file: string, res: Response): Promise<void> {
    const response = this.httpService.get(`${process.env.CDN}${file}`, { responseType: 'stream' });

    const stream = await lastValueFrom(response);

    res.setHeader('Content-Type', stream.headers['content-type']);
    res.setHeader('Content-Length', stream.headers['content-length']);
    res.setHeader('Content-Disposition', `attachment; filename="${stream.headers['file-name'] || 'downloadedFile'}"`);

    stream.data.pipe(res);
  }
}
