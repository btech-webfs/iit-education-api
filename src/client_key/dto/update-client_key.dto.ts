import { PartialType } from '@nestjs/swagger';
import { CreateClientKeyDto } from './create-client_key.dto';

export class UpdateClientKeyDto extends PartialType(CreateClientKeyDto) {}
