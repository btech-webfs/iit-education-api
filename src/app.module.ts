import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SubjectModule } from './subject/subject.module';
import { GradeModule } from './grade/grade.module';
import { TopicModule } from './topic/topic.module';
import { DataTypeModule } from './data_type/data_type.module';
import { ClientKeyModule } from './client_key/client_key.module';
import { DataPackModule } from './data_pack/data_pack.module';
import { DeviceModule } from './device/device.module';
import { PrismaModule } from './prisma/prisma.module';
import { DataModule } from './data/data.module';
import { SubDataModule } from './sub_data/sub_data.module';

@Module({
  imports: [AuthModule, SubjectModule, GradeModule, TopicModule, DataTypeModule, ClientKeyModule, DataPackModule, DeviceModule, PrismaModule, DataModule, SubDataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
