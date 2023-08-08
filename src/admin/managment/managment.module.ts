import { Module } from '@nestjs/common';
import { SemesterService } from './semester/semester.service';
import { SemesterController } from './semester/semester.controller';
import { CourseController } from './course/course.controller';
import { CourseService } from './course/course.service';

@Module({
  providers: [SemesterService, CourseService],
  controllers: [SemesterController, CourseController]
})
export class ManagmentModule {}
