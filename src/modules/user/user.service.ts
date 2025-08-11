import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { encryptText } from '@/common/utils/crypte';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const { email, full_name, password } = createUserDto;

    const data: Prisma.UserCreateInput = {
      email,
      full_name,
      ...(password && { password: await encryptText(password) }),
    };
    return await this.prismaService.user.create({
      data,
    });
  }

  async findAll() {
    return await this.prismaService.user.findMany();
  }

  async getByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: { email },
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

  /**
   * Updates user information by their identifier
   * @param id - The user's identifier
   * @param updateUserDto - The fields to update (password will be hashed if present)
   * @returns The updated user
   */
  async updateById(id: string, updateUserDto: Partial<CreateUserDto>) {
    const { password, ...rest } = updateUserDto;
    const dataToUpdate: Partial<CreateUserDto> = { ...rest };
    if (password) {
      dataToUpdate.password = await encryptText(password);
    }
    return await this.prismaService.user.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async updatePassword(id: string, password: string) {
    const hashedPassword = await encryptText(password);
    return await this.prismaService.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async updateLastLogin(id: string) {
    return await this.prismaService.user.update({
      where: { id },
      data: { updated_at: new Date() },
    });
  }
}
