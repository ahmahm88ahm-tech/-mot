import { IsEnum, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';

export class ConfirmPaymentDto {
  @IsEnum(['CASH', 'BANK_TRANSFER'], { message: 'طريقة الدفع: CASH أو BANK_TRANSFER فقط' })
  method!: 'CASH' | 'BANK_TRANSFER';

  @ValidateIf((o) => o.method === 'BANK_TRANSFER')
  @IsString({ message: 'مرجع التحويل مطلوب للتحويل البنكي' })
  @MaxLength(120)
  reference?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
