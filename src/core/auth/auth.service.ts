import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import GenerateOtp from 'src/utility/otp-generator';
import SendEmail from 'src/utility/send-email';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtservice: JwtService) {}
  private readonly prisma = new PrismaClient();

  async UserRegisrationOtpSend(to: string, full_name: string): Promise<any> {
    const generateNewOtp = GenerateOtp();
    try {
      //check user exist or not
      const checkIfUserAccountExist =
        await this.prisma.account_details.findUnique({
          where: {
            email: to,
          },
        });
      //check old otp
      const checkIfOtpExist = await this.prisma.otp.findUnique({
        where: {
          email: to,
        },
      });
      if (checkIfUserAccountExist) {
        return { message: 'Already registered . Please Login' };
      } else if (!checkIfUserAccountExist && !checkIfOtpExist) {
        await this.prisma.otp.create({
          data: {
            otp_code: generateNewOtp,
            email: to,
          },
        });
        await SendEmail(
          to,
          'Your verification code is ' +
            generateNewOtp +
            ' never share this code',
          'Student Portal Verification Code',
        );
        return { message: 'Verification Code Send' };
      } else if (checkIfOtpExist) {
        await this.prisma.otp.update({
          where: { email: to },
          data: {
            otp_code: generateNewOtp,
          },
        });
        await SendEmail(
          to,
          'Your verification code is ' +
            generateNewOtp +
            ' never share this code',
          'Student Portal Verification Code',
        );
        return {
          message: 'Verification Code Send',
          status: HttpStatus.OK,
        };
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Server Problem,Try Again',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async UserRegisterAndOtpVerify(
    to: string,
    full_name: string,
    otp: string,
  ): Promise<any> {
    try {
      const userInputOtp = otp;
      const checkIfOtpExist = await this.prisma.otp.findUnique({
        where: {
          email: to,
        },
      });
      //check otp input==db
      const checkAndVerifyOtp = checkIfOtpExist.otp_code === userInputOtp;
      if (checkAndVerifyOtp) {
        //create user table
        const createUser = await this.prisma.users.create({
          data: {
            full_name: full_name,
            type: 'user',
          },
        });
        //create user details
        const createUserDetails = await this.prisma.account_details.create({
          data: {
            users: {
              connect: {
                id: createUser.id,
              },
            },
            email: to,
          },
        });
        if (createUser && createUserDetails) {
          await this.prisma.otp.delete({
            where: {
              email: to,
            },
          });
          //now we are gonna generate token from their verification1
          const userId = createUser.id;
          const email = createUserDetails.email;
          const type = createUser.type;
          const payload = { userId, email, type };
          const access_token = this.jwtservice.sign(payload);
          return {
            message: 'Successfully Registered',
            status: HttpStatus.CREATED,
            access_token: access_token,
            userId: userId,
          };
        } else {
          return false;
        }
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Account Exist Please Login',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async UserLoginOtpSend(to: string): Promise<any> {
    const generateNewOtp = GenerateOtp();
    try {
      const checkRegisterUser = await this.prisma.account_details.findUnique({
        where: {
          email: to,
        },
      });
      const checkIfOtpExist = await this.prisma.otp.findUnique({
        where: {
          email: to,
        },
      });
      if (!checkRegisterUser) {
        throw new NotFoundException('User Not Found');
      } else if (checkRegisterUser && !checkIfOtpExist) {
        await this.prisma.otp.create({
          data: {
            otp_code: generateNewOtp,
            email: to,
          },
        });
        await SendEmail(
          to,
          'Your verification code is ' +
            generateNewOtp +
            ' never share this code',
          'Student Portal Verification Code',
        );
        return {
          message: 'Otp Send',
          status: HttpStatus.OK,
        };
      } else if (checkIfOtpExist) {
        await this.prisma.otp.update({
          where: {
            email: to,
          },
          data: {
            otp_code: generateNewOtp,
          },
        });
        await SendEmail(
          to,
          'Your verification code is ' +
            generateNewOtp +
            ' never share this code',
          'Student Portal Verification Code',
        );
        return {
          message: 'Verification Code Send',
          status: HttpStatus.OK,
        };
      }
    } catch (error) {
      throw new HttpException(
        'Account Exist or Server Problem',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async UserLoginOtpVerify(to: string, otp: string): Promise<any> {
    const userInputOtp = otp;
    const checkIfOtpExist = await this.prisma.otp.findUnique({
      where: {
        email: to,
      },
    });
    const checkAndVerifyOtp = checkIfOtpExist.otp_code === userInputOtp;
    if (checkAndVerifyOtp) {
      await this.prisma.otp.delete({
        where: {
          email: to,
        },
      });
      const userData = await this.prisma.account_details.findUnique({
        where: {
          email: to,
        },
        include: {
          users: true,
        },
      });
      const userId = userData.users.id;
      const email = userData.email;
      const type = userData.users.type;
      const payload = { userId, email, type };
      const access_token = this.jwtservice.sign(payload);
      return {
        message: 'Successfully Login',
        status: HttpStatus.OK,
        access_token: access_token,
        userId: userId,
      };
    } else {
      throw new NotFoundException();
    }
  }

  async GetAllUsers(userId:string):Promise<any>{
    return this.prisma.users.findFirst({
        where:{
            id:userId
        },
        include:{
            account_details:true
        }
    })
  }
}
