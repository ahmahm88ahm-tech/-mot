import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @MinLength(2) firstName!: string;
  @IsString() @MinLength(2) lastName!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(8) phone!: string;
  @IsString() @MinLength(8) password!: string;
  @IsOptional() @IsString() cityId?: string;
}

export class LoginDto {
  @IsString() identifier!: string;
  @IsString() password!: string;
}

export class RefreshDto {
  @IsString() refreshToken!: string;
}

export class LogoutDto {
  @IsString() refreshToken!: string;
}
