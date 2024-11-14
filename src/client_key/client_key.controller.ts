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

  @Post('/random')
  createRandom(@Body() createClientKeyDto: CreateClientKeyDto) {
    return this.clientKeyService.createRandom(createClientKeyDto);
  }

  @Get()
  findAll() {
    return this.clientKeyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientKeyService.findOne(id);
  }

  @Patch()
  update(
    @Param('id') id: string, @Body() updateClientKeyDto: UpdateClientKeyDto,
  ) {
    return this.clientKeyService.update(id, updateClientKeyDto);
  }

  @Patch('/many')
  updateMany(
    @Body() updateClientKeyDto: UpdateClientKeyDto,
  ) {
    return this.clientKeyService.updateMany(updateClientKeyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientKeyService.remove(id);
  }

  @Post('/delete_many')
  removeMany(@Body() updateClientKeyDto: UpdateClientKeyDto) {
    return this.clientKeyService.removeMany(updateClientKeyDto);
  }
}
