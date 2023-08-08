import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SemesterDetailsDto } from 'src/common/dto/semester.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class SemesterService {
  private readonly prisma = new PrismaClient();

  async CreateSemester(semesterDetails: SemesterDetailsDto) {
    const newSemesterDetails = plainToClass(
      SemesterDetailsDto,
      semesterDetails,
    );
    try {
      const data = await this.prisma.semester_details.create({
        data: {
          ...newSemesterDetails,
        },
      });
      return {
        message: 'New Semester Created Successfully',
        data: data,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Fill the form correctly',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
