import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCandidatDto } from './dto/create-candidat.dto';
import { UpdateCandidatDto } from './dto/update-candidat.dto';
import { PrismaService } from '@/common/modules/prisma/prisma.service';

@Injectable()
export class CandidatService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCandidatDto) {
    // Vérifier que l’utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { numero_inscription: dto.numero_inscription },
    });
    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    // Vérifier que cet utilisateur n’est pas déjà candidat (unique userId)
    const existing = await this.prisma.candidat.findUnique({
      where: { userId: user.id },
    });
    if (existing) {
      throw new BadRequestException('Cet utilisateur est déjà candidat');
    }

    // Créer le candidat
    return this.prisma.candidat.create({
      data: {
        name: dto.name,
        userId: user.id,
        photo_profile: dto.photo_profile || null,
      },
    });
  }

  findAll() {
    return `This action returns all candidat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} candidat`;
  }

  update(id: number, updateCandidatDto: UpdateCandidatDto) {
    return `This action updates a #${id} candidat`;
  }

  remove(id: number) {
    return `This action removes a #${id} candidat`;
  }
}
