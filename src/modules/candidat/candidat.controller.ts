import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CandidatService } from './candidat.service';
import { CreateCandidatDto } from './dto/create-candidat.dto';
import { UpdateCandidatDto } from './dto/update-candidat.dto';
import { JwtGuard } from '@/common/guard/jwt.guard';

import { RolesGuard } from '@/common/guard/roles.guard';
import { UserRole } from '@prisma/client';
import { Roles } from '@/common/decorator/roles.decorator';

@UseGuards(JwtGuard, RolesGuard)
@Roles([UserRole.ADMIN])
@Controller('candidat')
export class CandidatController {
  constructor(private readonly candidatService: CandidatService) {}

  @Post()
  create(@Body() createCandidatDto: CreateCandidatDto) {
    return this.candidatService.create(createCandidatDto);
  }

  @Get()
  findAll() {
    return this.candidatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.candidatService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCandidatDto: UpdateCandidatDto,
  ) {
    return this.candidatService.update(+id, updateCandidatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.candidatService.remove(+id);
  }
}
