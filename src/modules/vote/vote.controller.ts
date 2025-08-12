import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { JwtGuard } from '@/common/guard/jwt.guard';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}
  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() dto: CreateVoteDto, @Req() req) {
    console.log('req.user:', req?.user);
    const userId = req.user.sub; // ou req.user.id selon ta payload JWT
    return this.voteService.create(dto, userId);
  }
  @Get()
  async findAllVotes() {
    try {
      const candidats = await this.voteService.findAll();
      return {
        message: 'Liste des candidats récupérée avec succès',
        success: true,
        status: 200,
        data: candidats,
      };
    } catch (error) {
      return {
        message: error.message ?? 'Erreur interne',
        success: false,
        status: 500,
        data: [],
      };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoteDto: UpdateVoteDto) {
    return this.voteService.update(+id, updateVoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voteService.remove(+id);
  }
}
