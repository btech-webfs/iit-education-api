import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('validate-key')
  validate(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.validate(createAuthDto);
  }

  @Public()
  @Post('signin')
  signIn(@Body() { id, password }) {
    return this.authService.signIn(id, password);
  }
}
