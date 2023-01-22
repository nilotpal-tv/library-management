import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Librarian, Reader } from '@prisma/client';
import { UserType } from 'src/iam/authorization/enums/user-type.enum';
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

  private async findReaderByEmail(email: string): Promise<Reader> {
    return this.prismaService.reader.findUnique({
      where: { email },
    });
  }

  private async findLibrarianEmail(email: string): Promise<Librarian> {
    return this.prismaService.librarian.findUnique({
      where: { email },
    });
  }

  private async findReaderByPhone(phone: string): Promise<Reader> {
    return this.prismaService.reader.findUnique({
      where: { phoneNumber: phone },
    });
  }

  private async findLibrarianByPhone(phone: string): Promise<Librarian> {
    return this.prismaService.librarian.findUnique({
      where: { phoneNumber: phone },
    });
  }

  async registerReader(signupDto: SignUpDto): Promise<Reader> {
    const existReaderWithEmail = await this.findReaderByEmail(signupDto.email);
    if (existReaderWithEmail)
      throw new ConflictException('Reader already exist with this email.');

    const existReaderWithPhone = await this.findReaderByPhone(
      signupDto.phoneNumber,
    );
    if (existReaderWithPhone)
      throw new ConflictException(
        'Reader already exist with this phone number.',
      );

    const { password, ...rest } = signupDto;
    const hashedPassword = await this.hashService.hash(password);

    return this.prismaService.reader.create({
      data: { ...rest, password: hashedPassword },
    });
  }

  async loginReader(signinDto: SignInDto): Promise<TokenResponse> {
    const reader = await this.findReaderByEmail(signinDto.email);
    if (!reader) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await this.hashService.compare(
      signinDto.password,
      reader.password,
    );
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    return this.tokenService.signTokens({
      sub: reader.id,
      email: reader.email,
      userType: UserType.Reader,
    });
  }

  async registerLibrarian(signupDto: SignUpDto): Promise<Librarian> {
    const existLibrarian = await this.findLibrarianEmail(signupDto.email);
    if (existLibrarian)
      throw new ConflictException('Reader already exist with this email.');

    const existReaderWithPhone = await this.findLibrarianByPhone(
      signupDto.phoneNumber,
    );
    if (existReaderWithPhone)
      throw new ConflictException(
        'Librarian already exist with this phone number.',
      );

    const { password, ...rest } = signupDto;
    const hashedPassword = await this.hashService.hash(password);

    return this.prismaService.librarian.create({
      data: { ...rest, password: hashedPassword },
    });
  }

  async loginLibrarian(signinDto: SignInDto): Promise<TokenResponse> {
    const librarian = await this.findLibrarianEmail(signinDto.email);
    if (!librarian)
      throw new UnauthorizedException('Invalid email or password');

    const isMatch = await this.hashService.compare(
      signinDto.password,
      librarian.password,
    );
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    return this.tokenService.signTokens({
      sub: librarian.id,
      email: librarian.email,
      userType: UserType.Librarian,
    });
  }
}
