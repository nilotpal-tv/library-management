import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Librarian, Reader } from '@prisma/client';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from '../dtos/sign-in.dto';
import { SignUpDto } from '../dtos/sign-up.dto';
import { TokenResponse } from '../types/token-response';
import { TokenService } from './token.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly hashService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  private async findReader(email: string): Promise<Reader> {
    return this.prismaService.reader.findUnique({
      where: { email },
    });
  }

  private async findLibrarian(email: string): Promise<Librarian> {
    return await this.prismaService.librarian.findUnique({
      where: { email },
    });
  }

  async registerReader(signupDto: SignUpDto): Promise<Reader> {
    const existReader = await this.findReader(signupDto.email);
    if (existReader)
      throw new ConflictException('Reader already exist with this email.');

    const { password, ...rest } = signupDto;
    const hashedPassword = await this.hashService.hash(password);

    const reader = await this.prismaService.reader.create({
      data: { ...rest, password: hashedPassword },
    });

    return reader;
  }

  async loginReader(signinDto: SignInDto): Promise<TokenResponse> {
    const reader = await this.findReader(signinDto.email);
    if (!reader) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await this.hashService.compare(
      signinDto.password,
      reader.password,
    );
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    const tokens = await this.tokenService.signTokens({
      sub: reader.id,
      email: reader.email,
    });
    return tokens;
  }

  async registerLibrarian(signupDto: SignUpDto): Promise<Librarian> {
    const existLibrarian = await this.findLibrarian(signupDto.email);
    if (existLibrarian)
      throw new ConflictException('Reader already exist with this email.');

    const { password, ...rest } = signupDto;
    const hashedPassword = await this.hashService.hash(password);

    const librarian = await this.prismaService.librarian.create({
      data: { ...rest, password: hashedPassword },
    });

    return librarian;
  }

  async loginLibrarian(signinDto: SignInDto): Promise<TokenResponse> {
    const librarian = await this.findLibrarian(signinDto.email);
    if (!librarian)
      throw new UnauthorizedException('Invalid email or password');

    const isMatch = await this.hashService.compare(
      signinDto.password,
      librarian.password,
    );
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    const tokens = await this.tokenService.signTokens({
      sub: librarian.id,
      email: librarian.email,
    });
    return tokens;
  }
}
