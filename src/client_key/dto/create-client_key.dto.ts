import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClientKeyDto {
  @IsNotEmpty()
  key: string;

  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  deviceIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dataPackIds?: string[];
}
