import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseDetailsDto } from 'src/common/dto/course.dto';

@Controller('/admin/course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post('create/:semesterId')
  async CreateCourse(
    @Param('semesterId') semesterId: string,
    @Body() courseDetails: CourseDetailsDto,
  ): Promise<CourseDetailsDto> {
    return this.courseService.CreateCourse(courseDetails, semesterId);
  }

  @Get('all')
  async GeAllCourse(): Promise<CourseDetailsDto[]> {
    return this.courseService.GeAllCourse();
  }
}
