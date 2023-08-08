import { Body, Controller, Post } from '@nestjs/common';
import { SemesterService } from './semester.service';
import { SemesterDetailsDto } from 'src/common/dto/semester.dto';

@Controller('admin/semester')
export class SemesterController {
  constructor(private semesterService: SemesterService) {}

  @Post('create')
  async CreateSemester(@Body() semesterDetails: SemesterDetailsDto) {
    return this.semesterService.CreateSemester(semesterDetails);
  }
}
