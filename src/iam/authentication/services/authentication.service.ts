import { ConflictException, Injectable } from '@nestjs/common';
import { Librarian, Reader } from '@prisma/client';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from '../dtos/sign-up.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly hashService: HashingService,
    private readonly prismaService: PrismaService,
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
}
