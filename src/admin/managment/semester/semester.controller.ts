import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SemesterService } from './semester.service';
import { SemesterDetailsDto } from 'src/common/dto/semester.dto';

@Controller('admin/semester')
export class SemesterController {
  constructor(private semesterService: SemesterService) {}

  @Post('create')
  async CreateSemester(@Body() semesterDetails: SemesterDetailsDto) {
    return this.semesterService.CreateSemester(semesterDetails);
  }

  @Get('all')
  async GetAllSemester(): Promise<SemesterDetailsDto[]> {
    return this.semesterService.GetAllSemester();
  }

  @Delete('delete/:semesterId')
  async DeleteASemester(@Param('semesterId') semesterId: string): Promise<any> {
    return this.semesterService.DeleteASemester(semesterId);
  }
}
