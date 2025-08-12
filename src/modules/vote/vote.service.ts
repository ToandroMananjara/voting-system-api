import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { PrismaService } from '@/common/modules/prisma/prisma.service';

@Injectable()
export class VoteService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVoteDto, userId: string) {
    console.log('Creating vote with DTO:', dto);
    console.log('User ID:', userId);
    // Vérifier que le candidat existe
    const candidat = await this.prisma.candidat.findUnique({
      where: { id: dto.candidatId },
    });
    if (!candidat) {
      throw new BadRequestException('Candidat non trouvé');
    }

    // Vérifier si l'utilisateur a déjà voté (via isVoted)
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('Utilisateur non trouvé');

    if (user.isVoted) {
      throw new BadRequestException('Vous avez déjà voté');
    }

    // Transaction atomique : création vote + mise à jour isVoted
    await this.prisma.$transaction(async (prisma) => {
      await prisma.vote.create({
        data: {
          candidatId: dto.candidatId,
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { isVoted: true },
      });
    });

    return { message: 'Vote enregistré avec succès' };
  }

  async findAll() {
    return this.prisma.candidat.findMany({
      include: {
        _count: {
          select: { votes: true },
        },
      },
      orderBy: {
        votes: {
          _count: 'desc',
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} vote`;
  }

  update(id: number, updateVoteDto: UpdateVoteDto) {
    return `This action updates a #${id} vote`;
  }

  remove(id: number) {
    return `This action removes a #${id} vote`;
  }
}
