import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly productId: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  readonly quantity?: number = 1;
}
