import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { CourseDetailsDto } from 'src/common/dto/course.dto';

@Injectable()
export class CourseService {
  private readonly prisma = new PrismaClient();

  async CreateCourse(
    courseDetails: CourseDetailsDto,
    semesterId: string,
  ): Promise<any> {
    const newCourseDetails = plainToClass(CourseDetailsDto, courseDetails);
    try {
      const data = await this.prisma.course_details.create({
        data: {
          semester_details: {
            connect: { id: semesterId },
          },
          ...newCourseDetails,
        },
      });
      return {
        message: 'New Semester Created Successfully',
        data: data,
      };
    } catch (error) {
      throw new HttpException(
        'Fill the form correctly',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async GeAllCourse(): Promise<CourseDetailsDto[]> {
    try {
      return await this.prisma.course_details.findMany();
    } catch (error) {
      throw new HttpException('Server Problem', HttpStatus.BAD_REQUEST);
    }
  }
}
