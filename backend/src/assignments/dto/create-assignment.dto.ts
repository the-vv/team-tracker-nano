import { IsString, IsNotEmpty, IsUUID, IsDateString } from 'class-validator';

export class CreateAssignmentDto {
  @IsUUID()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  taskText!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;
}
