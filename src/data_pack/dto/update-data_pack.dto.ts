import { PartialType } from '@nestjs/swagger';
import { CreateDataPackDto } from './create-data_pack.dto';

export class UpdateDataPackDto extends PartialType(CreateDataPackDto) {}
