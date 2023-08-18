import { Type } from 'class-transformer';

export class AccountDetailsDto {
  id: any;
  mobile?: string;
  email?: string;
  @Type(() => Date)
  dob?: Date;
  present_address?: string;
}
