import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsJWT({ message: 'Invalid Refresh Token.' })
  @IsNotEmpty()
  token: string;
}
