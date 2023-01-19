import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Reader } from '@prisma/client';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthenticationService } from './services/authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('user-signup')
  async signupUser(@Body() signUpDto: SignUpDto): Promise<Reader> {
    return await this.authService.registerReader(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('user-login')
  async signinUser() {}

  @Post('librarian-signup')
  async signupLibrarian(@Body() signUpDto: SignUpDto) {
    return await this.authService.registerLibrarian(signUpDto);
  }

  @Post('librarian-login')
  async signinLibrarian() {}
}
