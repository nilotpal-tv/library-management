import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';
import { AddressDto } from './address.dto';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  middleName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsPhoneNumber('IN')
  phoneNumber: string;

  @IsNotEmptyObject()
  address: AddressDto;
}
