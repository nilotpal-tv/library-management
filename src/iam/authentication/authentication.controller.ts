import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Librarian, Reader } from '@prisma/client';
import { Auth } from './decorators/auth-type.decorator';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthType } from './enums/auth-type.enum';
import { AuthenticationService } from './services/authentication.service';
import { TokenResponse } from './types/token-response';

@Auth(AuthType.None)
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('signup')
  async signupUser(@Body() signUpDto: SignUpDto): Promise<Reader> {
    const reader = await this.authService.registerReader(signUpDto);
    delete reader.password;
    return reader;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signinUser(@Body() signInDto: SignInDto): Promise<TokenResponse> {
    return await this.authService.loginReader(signInDto);
  }

  @Post('librarian-signup')
  async signupLibrarian(@Body() signUpDto: SignUpDto): Promise<Librarian> {
    const librarian = await this.authService.registerLibrarian(signUpDto);
    delete librarian.password;
    return librarian;
  }

  @HttpCode(HttpStatus.OK)
  @Post('librarian-login')
  async signinLibrarian(@Body() signInDto: SignInDto): Promise<TokenResponse> {
    return await this.authService.loginLibrarian(signInDto);
  }
}
