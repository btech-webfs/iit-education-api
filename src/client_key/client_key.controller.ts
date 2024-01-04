import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common';
import { ClientKeyService } from './client_key.service';
import { CreateClientKeyDto } from './dto/create-client_key.dto';
import { UpdateClientKeyDto } from './dto/update-client_key.dto';

@Controller('client-key')
export class ClientKeyController {
  constructor(private readonly clientKeyService: ClientKeyService) { }

  @Post()
  create(@Body() createClientKeyDto: CreateClientKeyDto) {
    return this.clientKeyService.create(createClientKeyDto);
  }

  @Get()
  findAll() {
    return this.clientKeyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientKeyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClientKeyDto: UpdateClientKeyDto,
  ) {
    return this.clientKeyService.update(id, updateClientKeyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientKeyService.remove(id);
  }
}
