import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Librarian, Reader } from '@prisma/client';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthenticationService } from './services/authentication.service';
import { TokenResponse } from './types/token-response';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('user-signup')
  async signupUser(@Body() signUpDto: SignUpDto): Promise<Reader> {
    return await this.authService.registerReader(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('user-login')
  async signinUser(@Body() signInDto: SignInDto): Promise<TokenResponse> {
    return await this.authService.loginReader(signInDto);
  }

  @Post('librarian-signup')
  async signupLibrarian(@Body() signUpDto: SignUpDto): Promise<Librarian> {
    return await this.authService.registerLibrarian(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('librarian-login')
  async signinLibrarian(@Body() signInDto: SignInDto): Promise<TokenResponse> {
    return await this.authService.loginLibrarian(signInDto);
  }
}
