import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { encryptText } from '@/common/utils/crypte';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const { numeroInscription, password } = createUserDto;

    const data: Prisma.UserCreateInput = {
      ...(password && { password: await encryptText(password) }),
      numero_inscription: numeroInscription,
    };
    return await this.prismaService.user.create({
      data,
    });
  }

  async findAll() {
    return await this.prismaService.user.findMany();
  }

  async getByNumeroInscription(numeroInscription: string) {
    return await this.prismaService.user.findUnique({
      where: { numero_inscription: numeroInscription },
    });
  }

  /**
   * Retrieves a user by their unique identifier
   * @param id - The user's identifier
   * @returns The corresponding user or null
   */
  async getById(id: string) {
    return await this.prismaService.user.findUnique({
      where: { id },
    });
  }
}
