import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { User } from 'src/common/decorators/user.decorator';
import { AccountDetailsDto } from 'src/common/dto/account-details.dto';
import { JwtAuthGuard } from 'src/core/jwt-roles/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/update')
  async UpdateProfile(
    @User() user: any,
    @Body() profileDetails: AccountDetailsDto,
  ): Promise<AccountDetailsDto> {
    return this.profileService.UpdateProfile(user.userId, profileDetails);
  }
}
