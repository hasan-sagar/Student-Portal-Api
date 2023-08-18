import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { AccountDetailsDto } from 'src/common/dto/account-details.dto';

@Injectable()
export class ProfileService {
  private readonly prisma = new PrismaClient();

  async UpdateProfile(
    userId: any,
    profileDetails: AccountDetailsDto,
  ): Promise<AccountDetailsDto> {
    const newUpdateProfile = plainToClass(AccountDetailsDto, profileDetails);
    try {
      return await this.prisma.account_details.upsert({
        where: {
          user_id: userId,
        },
        update: {
          ...newUpdateProfile,
        },
        create: {
          users: {
            connect: { id: userId },
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        'Fill the form correctly',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
