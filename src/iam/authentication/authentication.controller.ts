import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Librarian, Reader } from '@prisma/client';
import { User } from '../authorization/decorators/user-type.decorator';
import { UserType } from '../authorization/enums/user-type.enum';
import { Auth } from './decorators/auth-type.decorator';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthType } from './enums/auth-type.enum';
import { AuthenticationService } from './services/authentication.service';
import { TokenResponse } from './types/token-response';

@Auth(AuthType.None)
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @User(UserType.Reader)
  @Post('signup')
  async signupUser(@Body() signUpDto: SignUpDto): Promise<Reader> {
    const reader = await this.authService.registerReader(signUpDto);
    delete reader.password;
    return reader;
  }

  @User(UserType.Reader)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signinUser(@Body() signInDto: SignInDto): Promise<TokenResponse> {
    return await this.authService.loginReader(signInDto);
  }

  @User(UserType.Librarian)
  @Post('librarian-signup')
  async signupLibrarian(@Body() signUpDto: SignUpDto): Promise<Librarian> {
    const librarian = await this.authService.registerLibrarian(signUpDto);
    delete librarian.password;
    return librarian;
  }

  @User(UserType.Librarian)
  @HttpCode(HttpStatus.OK)
  @Post('librarian-signin')
  async signinLibrarian(@Body() signInDto: SignInDto): Promise<TokenResponse> {
    return await this.authService.loginLibrarian(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<TokenResponse> {
    return await this.authService.refreshTokens(refreshTokenDto);
  }
}
