import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SemesterDetailsDto } from 'src/common/dto/semester.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class SemesterService {
  private readonly prisma = new PrismaClient();

  //create new semester
  async CreateSemester(semesterDetails: SemesterDetailsDto): Promise<any> {
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
  //get all semester
  async GetAllSemester(): Promise<SemesterDetailsDto[]> {
    try {
      const semeslterList: SemesterDetailsDto[] =
        await this.prisma.semester_details.findMany({});
      return semeslterList;
    } catch (error) {
      console.log(error);
      throw new HttpException('Server Problem', HttpStatus.BAD_REQUEST);
    }
  }

  //Delete a semester
  async DeleteASemester(semesterId: string): Promise<any> {
    try {
      await this.prisma.semester_details.delete({
        where: {
          id: semesterId,
        },
      });
      return {
        message: 'Semester Deleted',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Server Problem', HttpStatus.BAD_REQUEST);
    }
  }
}
