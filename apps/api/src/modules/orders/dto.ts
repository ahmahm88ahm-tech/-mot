import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateOrderDto {
  @IsString() serviceId!: string;
  @IsString() @MinLength(3) fromAddress!: string;
  @IsString() @MinLength(3) toAddress!: string;
  @IsNumber() fromLat!: number;
  @IsNumber() fromLng!: number;
  @IsNumber() toLat!: number;
  @IsNumber() toLng!: number;
  @IsOptional() @IsString() cityId?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() paymentMethod?: string;
}
