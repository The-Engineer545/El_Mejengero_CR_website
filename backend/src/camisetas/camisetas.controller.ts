import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards,
} from '@nestjs/common';
import { CamisetasService } from './camisetas.service';
import { CreateCamisetaDto } from './dto/create-camiseta.dto';
import { UpdateCamisetaDto } from './dto/update-camiseta.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('camisetas')
export class CamisetasController {
  constructor(private readonly camisetasService: CamisetasService) {}

  @Get()
  findAll() {
    return this.camisetasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.camisetasService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() datos: CreateCamisetaDto) {
    return this.camisetasService.create(datos);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: UpdateCamisetaDto,
  ) {
    return this.camisetasService.update(id, datos);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.camisetasService.remove(id);
  }
}